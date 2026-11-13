import { Container, Graphics, Ticker } from 'pixi.js';
import { t } from './i18n';
import { DESIGN_WIDTH } from './layout';
import { createLlama, LLAMA } from './logo';
import { QUESTION_SCENES } from './questionScenes';
import { COUNTRIES, QUESTIONS_PER_COUNTRY } from './questions';
import type { Quiz } from './quiz';
import { roadBlock } from './road';
import { addStopFlags, addTrail, STOPS } from './routeMap';
import { createText } from './text';
import { CONTENT_WIDTH, INDIGO, MADDER, MAIZE } from './theme';
import { weave } from './woven';
import { drawWorldMap, MAP_WIDTH, mapPoint } from './worldMap';

/** The map is scaled to the content width. Its window shows the band of the world that holds all four stops and their flags. */
const MAP_SCALE = CONTENT_WIDTH / MAP_WIDTH;
const MAP_HEIGHT = 190;
/** Scenes run edge to edge, which trims 48 units off each side: they keep what matters between x 54 and x 522. */
const SCENE_SCALE = 1.5;
const MAP_FIT = DESIGN_WIDTH / CONTENT_WIDTH;
const SHOWN_HEIGHT = Math.round(MAP_HEIGHT * SCENE_SCALE);
const MAP_WINDOW_TOP = 130;
const ROAD_GAP = 4;
const ROAD_HEIGHT = 16;
const ROAD_LEFT = (DESIGN_WIDTH - CONTENT_WIDTH) / 2;

/** Height of the picture and the road below it. */
export const STRIP_HEIGHT = SHOWN_HEIGHT + ROAD_GAP + ROAD_HEIGHT;

// Narrow enough to stop short of the flags of Prague and Berlin.
const LABEL_MAX_WIDTH = 196;
const LABEL_MARGIN = 12;
const LABEL_PADDING = 12;
const CURRENT_FLAG_SCALE = 1.25;
const MAP_LLAMA_CELL = 2;
const ROAD_LLAMA_CELL = 2;

const HOP_MS = 600;
const HOP_HEIGHT = 22;
const HOPS = 2;
const STUMBLE_MS = 900;
const STUMBLE_TILT = 0.25;
const STUMBLES = 4;
const RAIN_MS = 1800;
const RAIN_FADE_MS = 300;

const CLOUD = ['...XXX....', '.XXXXXXX..', 'XXXXXXXXXX'];
const CLOUD_CELL = 4;
const CLOUD_GAP = 26;
const CLOUD_GREY = 0x8a93ad;
const RAIN_BLUE = 0x9fc4e8;
const RAIN_FALL = 22;
const RAIN_DROP_MS = 340;
const RAIN_COLUMNS = [-12, 0, 12];

/**
 * The map and the road, so the journey stays in view during the questions. The llama stands on the
 * road at the current question. A right answer makes it hop along and turns the block gold. A wrong
 * one still moves it on, so nobody gets stuck, but it stumbles under a rain cloud and the block turns dark.
 */
export function createJourneyStrip(quiz: Quiz): Container {
  const strip = new Container();
  const stop = COUNTRIES.indexOf(quiz.current.country) + 1;

  const results = quiz.results;
  const question = quiz.completed;
  const answered = results.length > question;
  const createScene = QUESTION_SCENES[quiz.current.id];

  const picture = new Container();
  const clip = new Graphics().rect(0, 0, DESIGN_WIDTH, SHOWN_HEIGHT).fill(0xffffff);

  if (createScene) {
    picture.addChild(createScene(CONTENT_WIDTH, MAP_HEIGHT, answered));
    picture.scale.set(SCENE_SCALE);
  } else {
    drawMap(picture, stop);
    picture.scale.set(MAP_FIT);
  }

  picture.position.set(
    (DESIGN_WIDTH - CONTENT_WIDTH * picture.scale.x) / 2,
    SHOWN_HEIGHT - MAP_HEIGHT * picture.scale.x,
  );
  picture.mask = clip;
  strip.addChild(clip, picture);

  drawCountryLabel(strip, quiz);

  const block = (index: number) => roadBlock(index, quiz.total, QUESTIONS_PER_COUNTRY, CONTENT_WIDTH);
  const road = new Graphics();
  const roadTop = SHOWN_HEIGHT + ROAD_GAP;
  const drawBlock = (graphics: Graphics, index: number, color: number) => {
    const { left, right } = block(index);

    graphics.rect(ROAD_LEFT + left, roadTop, right - left, ROAD_HEIGHT).fill(color);
  };
  const resultColor = (right: boolean) => (right ? MAIZE : INDIGO);

  for (let index = 0; index < quiz.total; index++) {
    drawBlock(road, index, index < question ? resultColor(results[index]) : MADDER);
  }

  const llama = createLlama(ROAD_LLAMA_CELL);
  const startX = ROAD_LEFT + block(question).left;

  // Turns on its feet rather than its top corner.
  llama.pivot.set((LLAMA[0].length * ROAD_LLAMA_CELL) / 2, LLAMA.length * ROAD_LLAMA_CELL);
  llama.position.set(startX, roadTop);
  strip.addChild(road, llama);

  if (!answered) {
    return strip;
  }

  const right = results[question];
  const endX = ROAD_LEFT + block(question).right;
  const newBlock = new Graphics();

  drawBlock(newBlock, question, resultColor(right));
  strip.addChildAt(newBlock, strip.getChildIndex(llama));

  const finish = () => {
    llama.position.set(endX, roadTop);
    llama.rotation = 0;
    newBlock.alpha = 1;
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    finish();

    return strip;
  }

  const rain = right ? null : createRain();

  if (rain) {
    strip.addChild(rain.cloud);
  }

  const moveMs = right ? HOP_MS : STUMBLE_MS;
  const endMs = right ? HOP_MS : RAIN_MS;
  let elapsed = 0;
  const update = (ticker: Ticker) => {
    elapsed += ticker.deltaMS;

    const move = Math.min(1, elapsed / moveMs);

    llama.x = startX + (endX - startX) * move;
    newBlock.alpha = move;

    if (right) {
      llama.y = roadTop - Math.abs(Math.sin(move * Math.PI * HOPS)) * HOP_HEIGHT;
    } else {
      llama.rotation = Math.sin(move * Math.PI * STUMBLES) * STUMBLE_TILT * (1 - move);
    }

    rain?.place(llama.x, roadTop - LLAMA.length * ROAD_LLAMA_CELL - CLOUD_GAP, elapsed);

    if (elapsed >= endMs) {
      Ticker.shared.remove(update);
      finish();
      rain?.cloud.destroy({ children: true });
    }
  };

  newBlock.alpha = 0;
  update({ deltaMS: 0 } as Ticker);
  Ticker.shared.add(update);
  strip.once('destroyed', () => Ticker.shared.remove(update));

  return strip;
}

/** The window on the world: every stop, the flight from Lima, and the llama at its current stop. */
function drawMap(strip: Container, stop: number): void {
  const map = new Container();
  const mask = new Graphics().rect(0, 0, CONTENT_WIDTH, MAP_HEIGHT).fill(0xffffff);

  map.scale.set(MAP_SCALE);
  map.position.set(0, -MAP_WINDOW_TOP * MAP_SCALE);
  map.addChild(drawWorldMap(new Graphics(), MAP_WINDOW_TOP + MAP_HEIGHT / MAP_SCALE));

  addTrail(map, stop);

  addStopFlags(map)[stop].scale.set(CURRENT_FLAG_SCALE);

  // Standing at the foot of the flag, so the flag stays readable.
  const { longitude, latitude } = STOPS[stop];
  const foot = mapPoint(longitude, latitude);
  const llama = createLlama(MAP_LLAMA_CELL);

  llama.position.set(
    foot.x - (LLAMA[0].length * MAP_LLAMA_CELL) / 2,
    foot.y - LLAMA.length * MAP_LLAMA_CELL,
  );
  map.addChild(llama);
  map.mask = mask;
  strip.addChild(mask, map);
}

function drawCountryLabel(strip: Container, quiz: Quiz): void {
  const label = createText({
    text: t().countries[quiz.current.country],
    size: 26,
    fill: MAIZE,
    maxWidth: LABEL_MAX_WIDTH,
  });
  const labelWidth = label.width + 2 * LABEL_PADDING;
  const labelHeight = label.height + LABEL_PADDING;
  // The top left corner, which no stop, flight or llama on the road ever reaches.
  const labelLeft = LABEL_MARGIN;
  const labelTop = LABEL_MARGIN;

  label.anchor.set(0.5);
  label.position.set(labelLeft + labelWidth / 2, labelTop + labelHeight / 2);
  strip.addChild(new Graphics().rect(labelLeft, labelTop, labelWidth, labelHeight).fill(INDIGO), label);
}

/** A small cloud with falling drops. `place` follows the llama and fades the cloud out at the end. */
function createRain(): { cloud: Container; place: (x: number, y: number, elapsed: number) => void } {
  const cloud = new Container();
  const width = CLOUD[0].length * CLOUD_CELL;
  const drops = RAIN_COLUMNS.map((column) => {
    const drop = new Graphics().rect(column - 1.5, 0, 3, 8).fill(RAIN_BLUE);

    cloud.addChild(drop);

    return drop;
  });

  cloud.addChild(weave(new Graphics(), CLOUD, { X: CLOUD_GREY }, -width / 2, -CLOUD.length * CLOUD_CELL, CLOUD_CELL));

  return {
    cloud,
    place(x, y, elapsed) {
      cloud.position.set(x, y);
      cloud.alpha = Math.min(1, (RAIN_MS - elapsed) / RAIN_FADE_MS);
      drops.forEach((drop, index) => {
        drop.y = (((elapsed + (index * RAIN_DROP_MS) / drops.length) % RAIN_DROP_MS) / RAIN_DROP_MS) * RAIN_FALL;
      });
    },
  };
}
