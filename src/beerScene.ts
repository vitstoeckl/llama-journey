import { Container, Graphics } from 'pixi.js';
import { BeerMug, STREAM_WIDTH, STREAM_X } from './beerMug';
import { createLlama, LLAMA } from './logo';
import { weave } from './woven';

const WALL = 0x4a2c1a;
const PLANK_LINE = 0x3d2415;
const PLANK_WIDTH = 48;
const COUNTER = 0xb9762f;
const COUNTER_FRONT = 0x7a4a24;
const COUNTER_TOP_Y = 170;
const COUNTER_EDGE = 8;
const STEEL = 0xb8c0cc;

const TAP_BOTTOM = 30;
const TAP_NECK = 16;
const TAP_SPOUT = 12;
const MUG_TOP = COUNTER_TOP_Y - 96;

const KETTLE_CELL = 8;
const KETTLE = [
  '.....CC.......',
  '.....CC.......',
  '.....CC.......',
  '....CCCC......',
  '..CCCCCCCC....',
  '.CCCCHCCCCC...',
  'CCCCCHCCCCCC..',
  'CCCCCCCCCCCC..',
  'CCCCCCCCCCCCSS',
  'CCCCCCCCCCCC..',
  '.CCCCCCCCCC...',
  '..KK....KK....',
];
const KETTLE_COLORS = { C: 0xc8743a, H: 0xf0b070, K: 0x3d2415, S: STEEL };
const KETTLE_RIGHT_MARGIN = 54;

const LLAMA_CELL = 3;
const LLAMA_X = 60;

/**
 * A brewery in place of the map: a mug fills under the tap, with a copper kettle behind and
 * the llama looking on. `full` shows the mug already poured, for when the player has answered.
 */
export function createBeerScene(width: number, height: number, full: boolean): Container {
  const scene = new Container();
  const room = new Graphics().rect(0, 0, width, height).fill(WALL);

  for (let x = PLANK_WIDTH; x < width; x += PLANK_WIDTH) {
    room.rect(x, 0, 2, COUNTER_TOP_Y).fill(PLANK_LINE);
  }

  const kettle = weave(
    new Graphics(),
    KETTLE,
    KETTLE_COLORS,
    width - KETTLE[0].length * KETTLE_CELL - KETTLE_RIGHT_MARGIN,
    COUNTER_TOP_Y - KETTLE.length * KETTLE_CELL,
    KETTLE_CELL,
  );
  const counter = new Graphics()
    .rect(0, COUNTER_TOP_Y, width, COUNTER_EDGE)
    .fill(COUNTER)
    .rect(0, COUNTER_TOP_Y + COUNTER_EDGE, width, height - COUNTER_TOP_Y - COUNTER_EDGE)
    .fill(COUNTER_FRONT);

  const mug = new BeerMug(TAP_BOTTOM - MUG_TOP, full);

  mug.position.set((width - BeerMug.WIDTH) / 2, MUG_TOP);

  const streamCentre = mug.x + STREAM_X + STREAM_WIDTH / 2;
  const tap = new Graphics()
    .rect(streamCentre - TAP_NECK / 2, 0, TAP_NECK, TAP_BOTTOM - TAP_SPOUT)
    .fill(STEEL)
    .rect(streamCentre - STREAM_WIDTH, TAP_BOTTOM - TAP_SPOUT, 2 * STREAM_WIDTH, TAP_SPOUT)
    .fill(STEEL);

  const llama = createLlama(LLAMA_CELL);

  llama.position.set(LLAMA_X, COUNTER_TOP_Y - LLAMA.length * LLAMA_CELL);
  scene.addChild(room, kettle, counter, mug, tap, llama);

  return scene;
}
