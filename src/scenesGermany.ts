import { Container, Graphics } from 'pixi.js';
import { COUNTRY_THINGS, TIMBERED_HOUSE } from './countryArt';
import { createLlama, LLAMA } from './logo';
import { clamp01, popScale } from './motion';
import {
  AUSTRIAN_FLAG,
  centredPiece,
  createSmoke,
  createWaves,
  disc,
  flagPole,
  GERMAN_FLAG,
  peak,
  piece,
  play,
  SCENE_COLORS,
} from './sceneKit';

const [, , ANCIENT_POT, CAR] = COUNTRY_THINGS.germany;
const { W: PALE, K: BARK, D: DEEP_LEAF, G: LEAF, H: SEA, T: SAND_LIGHT, N: SLATE } = SCENE_COLORS;
const SKY = 0x9fd6ea;
const SAND = 0xc9985a;
const DARK_SAND = 0xa97a42;

const HUMMINGBIRD = [
  '.........................WW......WW..............',
  '........................W..W....W..W.............',
  '.......................W....W..W....W............',
  '.......................W.....WW.....W............',
  '........................W....WW....W.............',
  '.........................W...WW...W..............',
  '.....WW...................W..WW..W...............',
  '....W..W...................WWWWWW................',
  'WWWWW...WWWWWWWWWWWWWWWWWWW......W...............',
  '....W..W...................W......W......W...W..W',
  '.....WW.....................W......WWWWWW.W.W.W..',
  '.............................WWWWWW.......WW.W...',
  '.........................................W..W....',
];
const REICHE = [
  '..WWWWWW..',
  '.WWWWWWWW.',
  '...TTTT...',
  '...TTTT...',
  '...IIII...',
  '..IIIIII..',
  '..IIIIII..',
  '..IIIIII..',
  '..IIIIII..',
  '...T..T...',
  '...T..T...',
];
const BROOM = ['KK', 'KK', 'KK', 'KK', 'KK', 'KK', 'KK', 'KK', 'KK', 'KK', 'YY', 'YY', 'YY', 'YY'];

const BEER_MUG = [
  '.WWWWWWW...',
  'WWWWWWWWW..',
  'AYYYYYYYAAA',
  'AYYYYYYYA.A',
  'AYYYYYYYA.A',
  'AYYYYYYYA.A',
  'AYYYYYYYAAA',
  'AYYYYYYYA..',
  'AAAAAAAAA..',
];
const SPIRIT_BOTTLE = ['..KK..', '..AA..', '..AA..', '.AOOA.', 'AOOOOA', 'AWWWWA', 'AWKKWA', 'AWWWWA', 'AOOOOA', 'AAAAAA'];
const GLYPHS: Record<string, string[]> = {
  '?': ['WWW', '..W', '.WW', '...', '.W.'],
  '1': ['.W.', 'WW.', '.W.', '.W.', 'WWW'],
  '6': ['WWW', 'W..', 'WWW', 'W.W', 'WWW'],
  '8': ['WWW', 'W.W', 'WWW', 'W.W', 'WWW'],
};

/** Joins glyphs side by side, one empty column apart. */
function word(text: string): string[] {
  return GLYPHS['?'].map((_, row) => [...text].map((char) => GLYPHS[char][row]).join('.'));
}

/** G1. Beer, a strong drink and a car under three age signs. The ages (16, 18, 18) only appear after the answer. */
export function createAgeSigns(width: number, height: number, done: boolean): Container {
  const scene = new Container();
  const COUNTER = 140;
  const spots = [width / 2 - 140, width / 2, width / 2 + 140];
  const wall = new Graphics()
    .rect(0, 0, width, height)
    .fill(0x3a2a1e)
    .rect(0, COUNTER, width, 12)
    .fill(0xd4985a)
    .rect(0, COUNTER + 12, width, height - COUNTER - 12)
    .fill(BARK);

  for (let x = 20; x < width; x += 48) {
    wall.rect(x, 0, 3, COUNTER).fill(0x4a3626);
  }

  const things = [
    centredPiece(BEER_MUG, 6, spots[0], COUNTER - 27),
    centredPiece(SPIRIT_BOTTLE, 6, spots[1], COUNTER - 30),
    centredPiece(CAR, 6, spots[2], COUNTER - 24),
  ];
  const signs = spots.map((x, index) => {
    const sign = new Container();
    const board = new Graphics()
      .rect(-36, -22, 72, 44)
      .fill(index === 0 && done ? 0x1f7a4a : 0x23201f)
      .rect(-36, -22, 72, 4)
      .fill(PALE);
    const text = done ? (index === 0 ? '16' : '18') : '?';

    sign.addChild(board, centredPiece(word(text), 5, 0, 2));
    sign.position.set(x, 60);

    return sign;
  });

  scene.addChild(wall, ...things, ...signs);

  play(
    scene,
    (elapsed) => {
      signs.forEach((sign, index) => {
        const pop = done ? popScale(clamp01((elapsed - index * 250) / 400)) : 1;

        sign.scale.set(pop);
        sign.rotation = done ? 0 : Math.sin(elapsed / 500 + index) * 0.06;
      });
      things[0].y = COUNTER - 27 - Math.max(0, Math.sin(elapsed / 300)) * (done ? 6 : 0);
    },
    1600,
  );

  return scene;
}

/** G1. Maria Reiche sweeps the pampa. The lines she protected only appear after the answer. */
export function createSweptPampa(width: number, height: number, done: boolean): Container {
  const scene = new Container();
  const HORIZON = 46;
  const LINES_CELL = 6;
  const land = new Graphics()
    .rect(0, 0, width, height)
    .fill(SKY)
    .rect(0, HORIZON, width, height - HORIZON)
    .fill(SAND);

  peak(land, 300, HORIZON, 22, 90, DARK_SAND, 4);
  peak(land, 480, HORIZON, 30, 110, DARK_SAND, 4);

  for (let index = 0; index < 26; index++) {
    land.rect((index * 137) % width, HORIZON + 12 + ((index * 53) % 120), 6, 4).fill(DARK_SAND);
  }

  const figure = new Container();
  const broom = piece(BROOM, 4);

  broom.pivot.set(4, 0);
  broom.position.set(30, 36);
  figure.addChild(broom, piece(REICHE, 4));
  figure.y = 74;

  const dust = Array.from({ length: 5 }, () => new Graphics().rect(-4, -4, 8, 8).fill(SAND_LIGHT));
  const lines = piece(HUMMINGBIRD, LINES_CELL, 226, 60);
  const cover = new Graphics().rect(0, 0, 1, 1).fill(0xffffff);

  scene.addChild(land);

  if (done) {
    cover.position.set(lines.x, lines.y);
    lines.mask = cover;
    scene.addChild(lines, cover);
  }

  scene.addChild(...dust, figure);

  play(
    scene,
    (elapsed) => {
      figure.x = 104 + Math.sin(elapsed / 1500) * 46;
      broom.rotation = Math.sin(elapsed / 170) * 0.5;

      dust.forEach((puff, index) => {
        const rise = (elapsed / 800 + index / dust.length) % 1;

        puff.position.set(figure.x + 34 + Math.sin(index * 2.4) * 20 * rise, figure.y + 88 - rise * 16);
        puff.alpha = 1 - rise;
      });

      cover.scale.set(HUMMINGBIRD[0].length * LINES_CELL * clamp01(elapsed / 2600), HUMMINGBIRD.length * LINES_CELL);
    },
    2600,
  );

  return scene;
}

const MACAW_UP = ['....RR....', 'RRRRRRRRYY', '...RRRRRR.', '...YY.....', '...HH.....'];
const MACAW_DOWN = ['..........', 'RRRRRRRRYY', '...RRRRRR.', '..RRRHH...', '.RRH......'];
const PALM = [
  '..LL....LL..',
  '.LLLL..LLLL.',
  'LL..LLLL..LL',
  'L....KK....L',
  '.....KK.....',
  '.....KK.....',
  '.....KK.....',
  '.....KK.....',
  '.....KK.....',
];

/**
 * G2. The Autobahn: cars race past at different speeds on a three-lane road. Only after the answer does
 * the white sign with black stripes appear, the one that ends every speed limit.
 */
export function createAutobahn(width: number, height: number, done: boolean): Container {
  const scene = new Container();
  const ROAD_TOP = 78;
  const LANE = 32;
  const LANES = 3;
  const ROAD_BOTTOM = ROAD_TOP + LANE * LANES;
  const CAR_CELL = 4;
  const CAR_WIDTH = CAR[0].length * CAR_CELL;
  const land = new Graphics().rect(0, 0, width, height).fill(SKY);

  peak(land, 120, ROAD_TOP - 10, 50, 140, LEAF);
  peak(land, 430, ROAD_TOP - 10, 64, 170, LEAF);
  land
    .rect(0, ROAD_TOP - 14, width, 14)
    .fill(DEEP_LEAF)
    .rect(0, ROAD_TOP - 6, width, 4)
    .fill(PALE)
    .rect(0, ROAD_TOP, width, LANE * LANES)
    .fill(0x4a4f5a)
    .rect(0, ROAD_BOTTOM, width, 4)
    .fill(PALE)
    .rect(0, ROAD_BOTTOM + 4, width, height - ROAD_BOTTOM - 4)
    .fill(DEEP_LEAF);

  const dashes = new Graphics();
  const cars = [
    { lane: 0, speed: 0.14, start: 60 },
    { lane: 1, speed: 0.24, start: 300 },
    { lane: 2, speed: 0.36, start: 0 },
    { lane: 2, speed: 0.36, start: 340 },
  ].map(({ lane, speed, start }) => ({
    car: piece(CAR, CAR_CELL, 0, ROAD_TOP + lane * LANE + (LANE - CAR.length * CAR_CELL) / 2),
    speed,
    start,
  }));

  scene.addChild(land, dashes, ...cars.map(({ car }) => car));

  if (done) {
    // Germany's "end of all limits" sign: white, with black diagonal stripes.
    // Inside x 522, since the edges of a scene are trimmed on screen.
    const SIGN_X = width - 96;
    const SIGN_Y = 30;
    const RADIUS = 22;
    const sign = new Graphics()
      .rect(SIGN_X - 2, SIGN_Y, 4, ROAD_TOP - SIGN_Y - 4)
      .fill(0x8a93ad)
      .circle(SIGN_X, SIGN_Y, RADIUS)
      .fill(0xffffff)
      .stroke({ width: 2, color: 0x23201f });

    for (const offset of [-10, -5, 0, 5, 10]) {
      const reach = Math.sqrt(RADIUS * RADIUS - offset * offset) - 3;
      const along = reach / Math.SQRT2;
      const across = offset / Math.SQRT2;

      sign
        .moveTo(SIGN_X - along + across, SIGN_Y + along + across)
        .lineTo(SIGN_X + along + across, SIGN_Y - along + across)
        .stroke({ width: 2, color: 0x23201f });
    }

    scene.addChild(sign);
  }

  play(
    scene,
    (elapsed) => {
      dashes.clear();

      for (let lane = 1; lane < LANES; lane++) {
        for (let x = -((elapsed * 0.3) % 60); x < width; x += 60) {
          dashes.rect(x, ROAD_TOP + lane * LANE - 2, 30, 4);
        }
      }

      dashes.fill(PALE);

      const span = width + CAR_WIDTH;

      cars.forEach(({ car, speed, start }) => {
        car.x = ((start + elapsed * speed) % span) - CAR_WIDTH;
      });
    },
    1500,
  );

  return scene;
}

/** Spare question (Pozuzo), not in the game now. A Tyrolean house with its chimney smoking, deep in the jungle, with a macaw going past. */
export function createJungleHouse(width: number, height: number): Container {
  const scene = new Container();
  const GROUND = 150;
  const HOUSE_CELL = 8;
  const HOUSE_X = 216;
  const land = new Graphics().rect(0, 0, width, height).fill(SKY);

  peak(land, 90, GROUND, 110, 170, LEAF);
  peak(land, 470, GROUND, 130, 190, LEAF);
  peak(land, 280, GROUND, 74, 170, DEEP_LEAF);
  land.rect(0, GROUND, width, 16).fill(DEEP_LEAF);

  const river = new Graphics().rect(0, GROUND + 16, width, height - GROUND - 16).fill(SEA);
  const ripples = createWaves(width, GROUND + 26, PALE, 46);
  const house = piece(TIMBERED_HOUSE, HOUSE_CELL, HOUSE_X, GROUND - TIMBERED_HOUSE.length * HOUSE_CELL);
  const chimney = new Graphics().rect(HOUSE_X + 80, GROUND - 92, 12, 24).fill(BARK);
  const smoke = createSmoke(HOUSE_X + 86, GROUND - 96);
  const palms = [92, 160, 396, 488].map((x, index) => {
    const palm = piece(PALM, 6);

    palm.pivot.set(36, 54);
    palm.position.set(x, GROUND + 2);
    palm.scale.set(index % 2 ? 0.8 : 1);

    return palm;
  });
  const wings = [piece(MACAW_UP, 4), piece(MACAW_DOWN, 4)];
  const macaw = new Container();

  macaw.addChild(...wings);
  scene.addChild(
    land,
    smoke.view,
    chimney,
    house,
    flagPole(GERMAN_FLAG, 4, HOUSE_X - 26, GROUND, 66),
    flagPole(AUSTRIAN_FLAG, 4, HOUSE_X + 128, GROUND, 66),
    ...palms,
    river,
    ripples.view,
    macaw,
  );

  play(
    scene,
    (elapsed) => {
      smoke.update(elapsed);
      ripples.update(elapsed * 0.02);
      palms.forEach((palm, index) => {
        palm.rotation = Math.sin(elapsed / 800 + index) * 0.05;
      });

      const flight = (elapsed % 7000) / 7000;

      macaw.position.set(-50 + flight * (width + 100), 30 + Math.sin(flight * 16) * 8);

      const flap = Math.floor(elapsed / 180) % 2;

      wings[0].visible = flap === 0;
      wings[1].visible = flap === 1;
    },
    1800,
  );

  return scene;
}

const QUESTION_MARK = ['.YYYY.', 'YY..YY', '....YY', '...YY.', '..YY..', '..YY..', '......', '..YY..'];
const PENGUIN = [
  '...BBBB...',
  '..BBBBBB..',
  '..BBBWBBO.',
  '..BBBBBBOO',
  '..WBBBBW..',
  '.BWWBBWWB.',
  '.BWWWWWWB.',
  'BBWBBBBWBB',
  'B.WWWWWW.B',
  '..WWWWWW..',
  '..WWWWWW..',
  '...BBBB...',
  '..OO..OO..',
];
const SHORE_ROCK = [
  '........NNNNNNNN........',
  '.....NNNNNSSNNNNNNN.....',
  '...NNNNSSSNNNNNNNNNNN...',
  '..NNNNNNNNNNNNSSSNNNNN..',
  '.NNNNSSNNNNNNNNNNNNNNNN.',
  'NNNNNNNNNNNNNSSNNNNNNNNN',
  'NNNNNNNNNNNNNNNNNNNNNNNN',
];

/** G3. The cold coast, with something hiding behind the rock. The penguins come out after the answer. */
export function createPenguinCoast(width: number, height: number, done: boolean): Container {
  const scene = new Container();
  const SEA_TOP = 76;
  const ROCK_CELL = 8;
  const ROCK_X = 250;
  const ROCK_TOP = 106;
  const PENGUIN_CELL = 4;
  const water = new Graphics()
    .rect(0, 0, width, height)
    .fill(SKY)
    .rect(0, SEA_TOP, width, height - SEA_TOP)
    .fill(SEA);
  const sun = piece(disc(6, 'Y'), 4, 430, 12);
  const waveBands = [SEA_TOP + 14, SEA_TOP + 34, SEA_TOP + 62, SEA_TOP + 86].map((y, index) =>
    createWaves(width, y, PALE, 60 + index * 12),
  );
  const rock = piece(SHORE_ROCK, ROCK_CELL, ROCK_X, ROCK_TOP);
  const penguins = done
    ? [
        { x: ROCK_X + 62, delay: 200 },
        { x: ROCK_X + 118, delay: 500 },
      ].map(({ x, delay }) => ({ bird: piece(PENGUIN, PENGUIN_CELL, x, ROCK_TOP), delay }))
    : [];
  const mark = centredPiece(QUESTION_MARK, 6, ROCK_X + 96, 62);
  const fish = piece(['..SS...S', '.SSSSSSS', 'SSSSSS.S', '.SSSS...'], 3);

  mark.visible = !done;
  scene.addChild(
    water,
    sun,
    fish,
    ...waveBands.map(({ view }) => view),
    ...penguins.map(({ bird }) => bird),
    rock,
    mark,
  );

  play(
    scene,
    (elapsed) => {
      waveBands.forEach(({ update }, index) => {
        update(elapsed * (index + 1) * 0.012);
      });
      mark.y = 62 + Math.sin(elapsed / 350) * 5;

      const jump = (elapsed % 4200) / 900;

      fish.visible = jump < 1;
      fish.position.set(70 + jump * 80, SEA_TOP + 6 - Math.sin(jump * Math.PI) * 44);

      penguins.forEach(({ bird, delay }, index) => {
        const out = popScale(clamp01((elapsed - delay) / 500));
        const hop = Math.abs(Math.sin(elapsed / 220 + index)) * 6;

        bird.y = ROCK_TOP + 4 - (PENGUIN.length * PENGUIN_CELL + hop) * out;
      });
    },
    1000,
  );

  return scene;
}

const SPADE = [
  '..KK..',
  '..KK..',
  '..KK..',
  '..KK..',
  '..KK..',
  '..KK..',
  '..KK..',
  '.SSSS.',
  'SSSSSS',
  'SSSSSS',
  '.SSSS.',
  '..SS..',
];
const PYRAMID = [
  '..........TTTTTTTTTTTTTTTTTTTT..........',
  '..........CTCTCTCTCTCTCTCTCTCT..........',
  '.......TTTTTTTTTTTTTTTTTTTTTTTTTT.......',
  '.......CTCTCTCTCTCTCTCTCTCTCTCTCT.......',
  '....TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT....',
  '....CTCTCTCTCTCTCTCTCTCTCTCTCTCTCTCT....',
  '.TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT.',
  '.CTCTCTCTCTCTCTCTCTCTCTCTCTCTCTCTCTCTCT.',
  'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
];

/** G4. Uhle's dig near Lima: a spade throws up sand and old pots. The great temple rises only after the answer. */
export function createDigSite(width: number, height: number, done: boolean): Container {
  const scene = new Container();
  const GROUND = 104;
  const PIT_X = 150;
  const PIT_WIDTH = 120;
  const PYRAMID_CELL = 6;
  const sky = new Graphics().rect(0, 0, width, height).fill(SKY);
  const sea = new Graphics().rect(0, GROUND - 14, width, 14).fill(SEA);
  const pyramid = piece(PYRAMID, PYRAMID_CELL, 280, GROUND);
  const earth = new Graphics()
    .rect(0, GROUND, width, height - GROUND)
    .fill(SAND)
    .rect(0, GROUND + 28, width, 6)
    .fill(DARK_SAND)
    .rect(0, GROUND + 60, width, 6)
    .fill(DARK_SAND)
    .rect(PIT_X, GROUND, PIT_WIDTH, height - GROUND)
    .fill(0x6f4d2a);
  const pots = [PIT_X + 8, PIT_X + 70].map((x) => piece(ANCIENT_POT, 3, x, GROUND + 50));
  const spade = piece(SPADE, 5);
  const grains = Array.from({ length: 10 }, () => new Graphics().rect(-3, -3, 6, 6).fill(SAND));
  const llama = createLlama(3);

  spade.pivot.set(15, 60);
  llama.position.set(58, GROUND + 6 - LLAMA.length * 3);
  scene.addChild(sky, sea);
  pyramid.visible = done;
  scene.addChild(pyramid, earth, ...pots, llama, spade, ...grains);

  play(
    scene,
    (elapsed) => {
      const dig = (elapsed % 1400) / 1400;
      const push = Math.sin(dig * Math.PI * 2);

      spade.position.set(PIT_X + 60 + push * 8, GROUND + 44 + push * 18);
      spade.rotation = -0.2 + push * 0.2;

      grains.forEach((grain, index) => {
        const flight = (dig + index * 0.1) % 1;

        grain.position.set(
          PIT_X + 60 + (index % 2 ? 1 : -1) * flight * (70 + index * 7),
          GROUND + 10 - Math.sin(flight * Math.PI) * (40 + index * 3),
        );
        grain.alpha = 1 - flight * 0.6;
      });

      pyramid.y = GROUND - PYRAMID.length * PYRAMID_CELL * clamp01(elapsed / 1800);
    },
    1800,
  );

  return scene;
}

const BARREL = [
  '..KKKKKKKK..',
  '.SSSSSSSSSS.',
  'KKKKKKKKKKKK',
  'KKKKKKKKKKKK',
  'SSSSSSSSSSSS',
  'KKKKKKKKKKKK',
  'KKKKKKKKKKKK',
  '.SSSSSSSSSS.',
  '..KKKKKKKK..',
];
const WHEEL = ['..KKKK..', '.K.KK.K.', 'K..KK..K', 'KKKKKKKK', 'KKKKKKKK', 'K..KK..K', '.K.KK.K.', '..KKKK..'];
const BOTTLE = [
  '...KK...',
  '...KK...',
  '...KK...',
  '..KKKK..',
  '.KKKKKK.',
  '.KKKKKK.',
  '.YYYYYY.',
  '.YWWWWY.',
  '.YWWWWY.',
  '.YYYYYY.',
  '.KKKKKK.',
  '.KKKKKK.',
];

/** G5. A German beer goes up to the Andes: the llama pulls a cart of barrels along an Inca wall. */
export function createBarrelCart(width: number, height: number): Container {
  const scene = new Container();
  const ROAD = 142;
  const CART_WIDTH = 150;
  const land = new Graphics().rect(0, 0, width, height).fill(SKY);

  peak(land, 150, ROAD, 86, 150, SLATE);
  peak(land, 380, ROAD, 110, 170, SLATE);
  peak(land, 380, ROAD - 78, 32, 50, PALE);
  peak(land, 150, ROAD - 60, 26, 46, PALE);

  land.rect(0, ROAD, width, height - ROAD).fill(0x8d7f6b);

  for (let row = 0; row < 3; row++) {
    for (let x = row % 2 ? -20 : 0; x < width; x += 58) {
      land.rect(x + 2, ROAD + 2 + row * 16, 54, 14).fill(0xb5a78e);
    }
  }

  const cart = new Container();
  const wheels = [24, 110].map((x) => centredPiece(WHEEL, 3, x, 66));
  const foam = new Graphics().rect(0, 0, 48, 6).fill(PALE).rect(62, 0, 48, 6).fill(PALE);

  foam.position.set(6, 8);
  cart.y = ROAD - 78;
  cart.addChild(
    new Graphics().rect(0, 48, CART_WIDTH - 16, 10).fill(BARK).rect(CART_WIDTH - 16, 44, 36, 4).fill(BARK),
    piece(BARREL, 4, 6, 12),
    piece(BARREL, 4, 68, 12),
    foam,
    ...wheels,
    flagPole(GERMAN_FLAG, 3, 54, 50, 56),
  );

  const llama = createLlama(3);
  const train = new Container();

  llama.x = CART_WIDTH + 14;
  train.addChild(cart, llama);

  const bottles = [406, 448, 490].map((x) => piece(BOTTLE, 4, x, ROAD - BOTTLE.length * 4));

  scene.addChild(land, ...bottles, train);

  const span = width + CART_WIDTH + 130;

  play(
    scene,
    (elapsed) => {
      train.x = ((elapsed * 0.06) % span) - CART_WIDTH - 100;
      llama.y = ROAD - LLAMA.length * 3 - Math.abs(Math.sin(elapsed / 170)) * 3;
      wheels.forEach((wheel) => {
        wheel.rotation = elapsed / 300;
      });
      foam.scale.y = 1 + Math.sin(elapsed / 200) * 0.5;
    },
    4500,
  );

  return scene;
}
