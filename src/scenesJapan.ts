import { Container, Graphics } from 'pixi.js';
import { COUNTRY_LANDMARKS } from './countryArt';
import { clamp01, popScale } from './motion';
import {
  centredPiece,
  createSmoke,
  createWaves,
  disc,
  flagPole,
  JAPANESE_FLAG,
  peak,
  PERU_FLAG,
  piece,
  play,
  SCENE_COLORS,
} from './sceneKit';

const { W: PALE, Y: GOLD, K: BARK, S: STEEL, D: DEEP_LEAF, G: LEAF, H: SEA, T: STONE, R: VERMILION, P: PETAL } =
  SCENE_COLORS;
const SKY = 0x9fd6ea;
const SAND = 0xc9985a;
const DARK_SAND = 0xa97a42;

const STEAMSHIP = [
  '................RR........',
  '................RR........',
  '................BB........',
  '.........WWWWWWWWWWWWW....',
  '.........WIWIWIWIWIWIW....',
  '......WWWWWWWWWWWWWWWWWW..',
  'BBBBBBBBBBBBBBBBBBBBBBBBBB',
  'BWBWBWBWBBBBBBBBBBBBBBBBB.',
  '.RRRRRRRRRRRRRRRRRRRRRRRR.',
  '..RRRRRRRRRRRRRRRRRRRRRR..',
];

/** J1. The Sakura Maru steams across the Pacific towards Callao, with cherry petals on the wind. */
export function createSakuraShip(width: number, height: number): Container {
  const scene = new Container();
  const SEA_TOP = 118;
  const SHIP_CELL = 6;
  const sky = new Graphics()
    .rect(0, 0, width, height)
    .fill(0xf7cfae)
    .rect(0, SEA_TOP, width, height - SEA_TOP)
    .fill(SEA);
  const sun = piece(disc(8, 'R'), 4, 330, 24);
  const pier = new Graphics().rect(width - 96, SEA_TOP - 8, 96, 12).fill(BARK).rect(width - 70, SEA_TOP, 8, 20).fill(BARK);
  const ship = new Container();
  const smoke = createSmoke(17 * SHIP_CELL, 0);

  ship.pivot.set((STEAMSHIP[0].length * SHIP_CELL) / 2, STEAMSHIP.length * SHIP_CELL);
  ship.addChild(smoke.view, piece(STEAMSHIP, SHIP_CELL), flagPole(JAPANESE_FLAG, 3, 3 * SHIP_CELL, 36, 34));

  const backWaves = createWaves(width, SEA_TOP + 8, PALE, 70);
  const frontWaves = [SEA_TOP + 22, SEA_TOP + 44].map((y, index) => createWaves(width, y, PALE, 52 + index * 20));
  const petals = Array.from({ length: 16 }, () => new Graphics().rect(-3, -2, 6, 4).fill(PETAL));

  scene.addChild(
    sky,
    sun,
    pier,
    flagPole(PERU_FLAG, 4, width - 84, SEA_TOP - 8, 48),
    backWaves.view,
    ship,
    ...frontWaves.map(({ view }) => view),
    ...petals,
  );

  play(
    scene,
    (elapsed) => {
      const voyage = (elapsed % 16000) / 16000;

      ship.position.set(-90 + voyage * (width + 40), SEA_TOP + 18 + Math.sin(elapsed / 500) * 3);
      ship.rotation = Math.sin(elapsed / 700) * 0.025;
      smoke.update(elapsed);
      backWaves.update(elapsed * 0.012);
      frontWaves.forEach(({ update }, index) => {
        update(elapsed * 0.02 * (index + 1));
      });
      petals.forEach((petal, index) => {
        const fall = (elapsed / 5200 + index * 0.137) % 1;

        petal.position.set(((index * 97 + fall * 160) % width), fall * height + Math.sin(fall * 12 + index) * 6);
        petal.rotation = fall * 8 + index;
      });
    },
    8000,
  );

  return scene;
}

const MAKI = [
  '....BBBBB....',
  '..BBWWWWWBB..',
  '.BWWWWWWWWWB.',
  '.BWWWWWWWWWB.',
  'BWWWWFFFWWWWB',
  'BWWWFFFFFWWWB',
  'BWWWLLFFFWWWB',
  'BWWWLLLFFWWWB',
  'BWWWWLLLWWWWB',
  '.BWWWWWWWWWB.',
  '.BWWWWWWWWWB.',
  '..BBWWWWWBB..',
  '....BBBBB....',
];
const URAMAKI = [
  '....WWWWW....',
  '..WWWKWWWKW..',
  '.WKWBBBBBWWW.',
  '.WWBBOOOBBWK.',
  'WWBBOOOOOBBWW',
  'WKBOOOYYYOBWW',
  'WWBLLLYYYOBKW',
  'WWBLLLYYYOBWW',
  'WWBBLLLOOBBWW',
  '.KWBBLLLBBWW.',
  '.WWWBBBBBWKW.',
  '..WKWWWWWWW..',
  '....WWWWW....',
];
const STAR = ['..Y..', '.YYY.', 'YYYYY', '.YYY.', '..Y..'];

/** J1. Two rolls side by side: uramaki with the rice outside (left) and maki with the nori outside (right). After the answer the maki gets stars. */
export function createTwoRolls(width: number, height: number, done: boolean): Container {
  const scene = new Container();
  const BOARD = 140;
  const ROLL_CELL = 8;
  const centres = [width / 2 - 110, width / 2 + 110];
  const wall = new Graphics()
    .rect(0, 0, width, height)
    .fill(0x1d2559)
    .rect(0, BOARD, width, 14)
    .fill(0xd4985a)
    .rect(0, BOARD + 14, width, height - BOARD - 14)
    .fill(BARK);

  for (let x = 40; x < width; x += 56) {
    wall.rect(x, 0, 4, 48).fill(0x2b3a7a);
  }

  const rolls = [URAMAKI, MAKI].map((rows, index) =>
    centredPiece(rows, ROLL_CELL, centres[index], BOARD - (rows.length * ROLL_CELL) / 2 - 4),
  );
  const stars = done
    ? [-1, 0, 1].map((side) => ({ star: centredPiece(STAR, 4, centres[1] + side * 40, 16), delay: (side + 1) * 150 }))
    : [];
  const homes = rolls.map((roll) => roll.y);

  scene.addChild(wall, ...rolls, ...stars.map(({ star }) => star));

  play(
    scene,
    (elapsed) => {
      rolls.forEach((roll, index) => {
        const bob = Math.max(0, Math.sin(elapsed / 420 + index * Math.PI));

        roll.y = homes[index] - bob * (done && index === 1 ? 10 : 4);
      });
      stars.forEach(({ star, delay }, index) => {
        star.scale.set(popScale(clamp01((elapsed - delay) / 400)) * (1 + Math.sin(elapsed / 200 + index) * 0.1));
      });
    },
    1800,
  );

  return scene;
}

const DAIFUKU = ['..XXXXX..', '.XXXXXXX.', 'XXXXXXXXX', 'XXXXXXXXX', '.XXXXXXX.'];
const CUT_DAIFUKU = ['..WWWWW..', '.WWKKKWW.', 'WWKKKKKWW', 'WWWKKKWWW', '.WWWWWWW.'];
const DISH = ['.TTTTTTTTTTTTTTTTTTTTTTTTTT.', 'TNNNNNNNNNNNNNNNNNNNNNNNNNNT', '.TTTTTTTTTTTTTTTTTTTTTTTTTT.'];
const PLAIN_MOCHI = ['.CWWCWWWC.', 'WWWWWWWWWW', 'WWWWWWWWWW', 'WWWWWWWWWW', 'CWWWWWWWWC', '.CCCCCCCC.'];

/** J2. Filled daifuku on a dish (left) and plain mochi toasting on a grill (right). After the answer the right one gets stars. */
export function createMochiPair(width: number, height: number, done: boolean): Container {
  const scene = new Container();
  const BOARD = 140;
  const CELL = 6;
  const LEFT = width / 2 - 130;
  const RIGHT = width / 2 + 120;
  const wall = new Graphics()
    .rect(0, 0, width, height)
    .fill(0x1d2559)
    .rect(0, BOARD, width, 14)
    .fill(0xd4985a)
    .rect(0, BOARD + 14, width, height - BOARD - 14)
    .fill(BARK);

  for (let x = 40; x < width; x += 56) {
    wall.rect(x, 0, 4, 48).fill(0x2b3a7a);
  }

  const dish = centredPiece(DISH, CELL, LEFT, BOARD - 6);
  const sweets = [
    { colour: 'P', x: -48, y: -46 },
    { colour: 'G', x: 4, y: -50 },
    { colour: 'W', x: 52, y: -44 },
    { colour: 'Y', x: -24, y: -24 },
    { colour: 'cut', x: 30, y: -22 },
  ].map(({ colour, x, y }) =>
    centredPiece(colour === 'cut' ? CUT_DAIFUKU : DAIFUKU.map((row) => row.replaceAll('X', colour)), CELL, LEFT + x, BOARD + y),
  );
  const coals = new Graphics();
  const grate = new Graphics();

  for (let x = RIGHT - 84; x <= RIGHT + 84; x += 14) {
    grate.rect(x, BOARD - 40, 3, 34).fill(STEEL);
  }

  grate.rect(RIGHT - 90, BOARD - 40, 180, 4).fill(STEEL).rect(RIGHT - 90, BOARD - 10, 180, 4).fill(STEEL);

  const mochi = [-36, 36].map((x) => centredPiece(PLAIN_MOCHI, CELL, RIGHT + x, BOARD - 60));
  const stars = done
    ? [-1, 0, 1].map((side) => ({ star: centredPiece(STAR, 4, RIGHT + side * 56, 16), delay: (side + 1) * 150 }))
    : [];

  scene.addChild(wall, coals, grate, dish, ...sweets, ...mochi, ...stars.map(({ star }) => star));

  play(
    scene,
    (elapsed) => {
      coals.clear();

      for (let index = 0; index < 12; index++) {
        const glow = (Math.sin(elapsed / 180 + index * 1.7) + 1) / 2;

        coals.rect(RIGHT - 84 + index * 14, BOARD - 30 + glow * 6, 12, 26 - glow * 6).fill(glow > 0.5 ? GOLD : VERMILION);
      }

      mochi.forEach((cake, index) => {
        const puff = (Math.sin(elapsed / 700 + index * 2) + 1) / 2;

        cake.scale.set(1 + puff * 0.06, 1 + puff * (done ? 0.18 : 0.08));
      });
      stars.forEach(({ star, delay }, index) => {
        star.scale.set(popScale(clamp01((elapsed - delay) / 400)) * (1 + Math.sin(elapsed / 200 + index) * 0.1));
      });
    },
    1800,
  );

  return scene;
}

const CLOUD = ['...WWWW.....', '.WWWWWWWWW..', 'WWWWWWWWWWWW', '.WWWWWWWWWW.'];
const RUINS = [
  '......TT.......TT......',
  '.....TTTT.....TTTT.TT..',
  '..TT.TIIT.TTT.TIIT.TT..',
  '..TT.TTTT.TIT.TTTT.TT..',
  'SSSSSSSSSSSSSSSSSSSSSSS',
  'LLLLLLLLLLLLLLLLLLLLLLL',
  '..SSSSSSSSSSSSSSSSSSSS.',
  '..LLLLLLLLLLLLLLLLLLLL.',
  '....SSSSSSSSSSSSSSSSS..',
];
const CARRIAGE = ['HHHHHHHHHHHHHHHH', 'HAAHHAAHHAAHHAAH', 'HAAHHAAHHAAHHAAH', 'YYYYYYYYYYYYYYYY', 'HHHHHHHHHHHHHHHH', '.BB..........BB.'];
const ENGINE = ['....HHHHHHHHHHHH', '...HHAAHHAAHHHHH', '..HHHAAHHAAHHHHH', 'YYYYYYYYYYYYYYYY', 'HHHHHHHHHHHHHHHH', '.BB..........BB.'];

/** J2. A train runs along the valley below a mountain hidden in cloud. After the answer the cloud lifts off the citadel. */
export function createCloudedPeak(width: number, height: number, done: boolean): Container {
  const scene = new Container();
  const VALLEY = 150;
  const TRAIN_CELL = 4;
  const land = new Graphics().rect(0, 0, width, height).fill(SKY);

  peak(land, 440, VALLEY, 130, 150, DEEP_LEAF);
  peak(land, 290, VALLEY, 92, 200, LEAF);
  peak(land, 80, VALLEY, 70, 130, DEEP_LEAF);
  land.rect(0, VALLEY, width, height - VALLEY).fill(0x6f5a3e).rect(0, VALLEY + 8, width, 4).fill(STEEL);

  const ruins = piece(RUINS, 6, 222, 40);
  const train = new Container();

  [0, 1, 2].forEach((index) => {
    train.addChild(piece(index === 2 ? ENGINE : CARRIAGE, TRAIN_CELL, index * 70, VALLEY - 16));
  });

  const smoke = createSmoke(2 * 70 + 44, VALLEY - 18, 3);

  train.addChild(smoke.view);
  ruins.visible = done;

  const clouds = [
    { x: 200, y: 26, cell: 10, drift: -1 },
    { x: 340, y: 46, cell: 9, drift: 1 },
    { x: 270, y: 8, cell: 8, drift: 1 },
    { x: 420, y: 16, cell: 8, drift: 1 },
  ].map(({ x, y, cell, drift }) => ({ cloud: piece(CLOUD, cell, x, y), x, drift }));

  scene.addChild(land, ruins, train, ...clouds.map(({ cloud }) => cloud));

  play(
    scene,
    (elapsed) => {
      train.x = ((elapsed * 0.07) % (width + 240)) - 220;
      smoke.update(elapsed);

      const lift = done ? clamp01((elapsed - 200) / 1600) : 0;

      clouds.forEach(({ cloud, x, drift }, index) => {
        cloud.x = x + Math.sin(elapsed / 1400 + index) * 8 + drift * lift * 300;
        cloud.alpha = 1 - lift * 0.2;
      });
    },
    2000,
  );

  return scene;
}

const PLATE = [
  '....SSSSSSSSSSSSSSSSSSSSSSSS....',
  '.SSSWWWWWWWWWWWWWWWWWWWWWWWWSSS.',
  'SWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWS',
  '.SSSWWWWWWWWWWWWWWWWWWWWWWWWSSS.',
  '....SSSSSSSSSSSSSSSSSSSSSSSS....',
];
const SLICE = ['..FFFFFFFF', '.FFWFFFWFF', 'FFFFFFFFF.', 'WWWWWWWW..'];
const LIME = ['..LLLL..', '.LWWWWL.', 'LWLWWLWL', 'LLLLLLLL'];
const SLICE_CELL = 4;

/** J3. Nikkei: raw fish with Peruvian lime, eaten with Japanese chopsticks, under both flags. */
export function createNikkeiPlate(width: number, height: number): Container {
  const scene = new Container();
  const COUNTER = 132;
  const PLATE_CELL = 7;
  const PLATE_X = (width - PLATE[0].length * PLATE_CELL) / 2;
  const PLATE_Y = COUNTER - 8;
  const REST_Y = PLATE_Y - SLICE.length * SLICE_CELL + 8;
  const wall = new Graphics()
    .rect(0, 0, width, height)
    .fill(0x1d2559)
    .rect(0, COUNTER, width, 10)
    .fill(0xd4985a)
    .rect(0, COUNTER + 10, width, height - COUNTER - 10)
    .fill(BARK);

  for (let x = 120; x < width; x += 56) {
    wall.rect(x, 0, 4, 64).fill(0x2b3a7a);
  }

  const peru = piece(PERU_FLAG, 7, 170, 18);
  const japan = piece(JAPANESE_FLAG, 7, 366, 18);
  const heart = piece(['.RR.RR.', 'RRRRRRR', '.RRRRR.', '..RRR..', '...R...'], 5, 270, 26);
  const plate = piece(PLATE, PLATE_CELL, PLATE_X, PLATE_Y);
  const slices = [0, 1, 2].map((index) => piece(SLICE, SLICE_CELL, PLATE_X + 34 + index * 46, REST_Y));
  const lime = piece(LIME, 4, PLATE_X + 174, REST_Y + 2);
  const onions = new Graphics().rect(PLATE_X + 30, REST_Y - 4, 10, 4).fill(SCENE_COLORS.V).rect(PLATE_X + 106, REST_Y - 6, 10, 4).fill(SCENE_COLORS.V).rect(PLATE_X + 150, REST_Y - 3, 10, 4).fill(SCENE_COLORS.V);
  const chopsticks = new Graphics()
    .rect(0, -4, 6, 130)
    .fill(0x6b2316)
    .rect(16, -4, 6, 130)
    .fill(0xa23a24);
  const lifted = slices[2];
  const homeX = lifted.x;
  const drops = [0, 1, 2].map(() => new Graphics().rect(-2, -3, 4, 6).fill(SCENE_COLORS.L));
  const CYCLE_MS = 3600;

  chopsticks.pivot.set(11, 126);
  scene.addChild(wall, peru, japan, heart, plate, ...slices, onions, lime, ...drops, chopsticks);

  play(
    scene,
    (elapsed) => {
      const turn = (elapsed % CYCLE_MS) / CYCLE_MS;
      const down = Math.max(0, Math.sin(turn * Math.PI));
      const away = 1 - down;
      const carried = turn > 0.5 ? away : 0;

      chopsticks.rotation = -0.5;
      chopsticks.position.set(homeX + 20 + 110 * away, REST_Y + 6 - 60 * away);
      lifted.position.set(homeX + 110 * carried, REST_Y - 60 * carried);
      lifted.alpha = Math.min(clamp01(turn * 8), clamp01((1 - turn) * 6));

      drops.forEach((drop, index) => {
        const fall = (elapsed / 900 + index / drops.length) % 1;

        drop.position.set(PLATE_X + 40 + index * 56, 72 + fall * (REST_Y - 72));
        drop.alpha = 1 - fall * 0.3;
      });

      heart.scale.set(1 + Math.sin(elapsed / 300) * 0.08);
    },
    CYCLE_MS / 4,
  );

  return scene;
}

const LIMA_CHURCH = [
  '...Y.............Y...',
  '..TTT...........TTT..',
  '..TTT...........TTT..',
  '.TTTTT.........TTTTT.',
  '.TKTKT.........TKTKT.',
  '.TTTTT....Y....TTTTT.',
  '.TKTKT..TTTTT..TKTKT.',
  '.TTTTTTTTTTTTTTTTTTT.',
  '.TTTTTTTKTTTKTTTTTTT.',
  '.TTTTTTTTTTTTTTTTTTT.',
  '.TTKTTTTT...TTTTTKTT.',
  '.TTKTTTT.....TTTTKTT.',
  'TTTTTTTT.....TTTTTTTT',
];
const FLAME = ['..Y..', '.YOY.', 'YOROY', 'YORRY', '.YOY.'];

/** J4. Tokyo and Lima shake while the needle scribbles. After the answer the ring of fire lights up around the Pacific. */
export function createQuakeScene(width: number, height: number, done: boolean): Container {
  const scene = new Container();
  const GROUND = 142;
  const SEA_TOP = 64;
  const LINE_Y = GROUND + 24;
  const QUAKE_EVERY_MS = 3200;
  const QUAKE_MS = 1300;
  const RING_RADIUS = 56;
  const RING_X = width / 2;
  const RING_Y = 78;
  const land = new Graphics()
    .rect(0, 0, width, height)
    .fill(SKY)
    .rect(0, SEA_TOP, width, GROUND - SEA_TOP)
    .fill(SEA)
    .rect(0, GROUND, width, height - GROUND)
    .fill(0xefe3c8);
  const tower = COUNTRY_LANDMARKS.japan;
  const towerPiece = piece(tower.rows, 4, 60, GROUND - tower.rows.length * 4);
  const church = piece(LIMA_CHURCH, 5, width - LIMA_CHURCH[0].length * 5 - 58, GROUND - LIMA_CHURCH.length * 5);
  const trace = new Graphics();
  const flames = done
    ? Array.from({ length: 14 }, (_, index) => {
        const angle = (index / 14) * Math.PI * 2;

        return centredPiece(FLAME, 3, RING_X + Math.cos(angle) * RING_RADIUS * 1.25, RING_Y + Math.sin(angle) * RING_RADIUS);
      })
    : [];
  const waves = createWaves(width, SEA_TOP + 18, PALE, 40);
  const wavesFar = createWaves(width, SEA_TOP + 48, PALE, 56);

  scene.addChild(land, waves.view, wavesFar.view, towerPiece, church, trace, ...flames);

  const strength = (time: number) => {
    const inQuake = (time % QUAKE_EVERY_MS) / QUAKE_MS;

    return inQuake < 1 ? Math.sin(inQuake * Math.PI) : 0;
  };
  const towerHome = towerPiece.x;
  const churchHome = church.x;

  play(
    scene,
    (elapsed) => {
      const shake = strength(elapsed) * 5;

      towerPiece.x = towerHome + Math.sin(elapsed / 28) * shake;
      church.x = churchHome + Math.sin(elapsed / 33) * shake;
      waves.update(elapsed * 0.02);
      wavesFar.update(elapsed * 0.03);

      trace.clear();

      for (let x = 0; x < width; x += 4) {
        const then = elapsed - (width - x) * 4;
        const swing = 2 + strength(Math.max(0, then)) * 18;

        trace.rect(x, LINE_Y + Math.sin(then / 19) * swing, 4, 3);
      }

      trace.fill(VERMILION);

      flames.forEach((flame, index) => {
        const lit = clamp01((elapsed - index * 100) / 300);

        flame.scale.set(popScale(lit) * (1 + Math.sin(elapsed / 90 + index * 2) * 0.12));
      });
    },
    2500,
  );

  return scene;
}

const DRONE = [
  'SSSSS......SSSSS',
  '..S..........S..',
  '..SSSSSSSSSSSS..',
  '....SSRSSRSS....',
  '.....SSAASS.....',
];
const FIGURE = [
  '.....WWWW.....',
  '....W.WW.W....',
  '....W....W....',
  '.....WWWW.....',
  '.WWWWWWWWWWWW.',
  'W.....WW.....W',
  '......WW......',
  '......WW......',
  '.....W..W.....',
  '....W....W....',
  '...WW....WW...',
];
const WALKER = [
  '..........WWW.',
  '.........W..WW',
  'WWWWWWWWWW....',
  'W........W....',
  'WWWWWWWWWW....',
  '.W.W....W.W...',
  '.W.W....W.W...',
];

/** J5. A survey drone sweeps its beam over the plain. The figures it has been looking for appear after the answer. */
export function createDroneSurvey(width: number, height: number, done: boolean): Container {
  const scene = new Container();
  const HORIZON = 46;
  const FIGURES_LEFT = 170;
  const FIGURES_WIDTH = 310;
  const REVEAL_MS = 2800;
  const land = new Graphics()
    .rect(0, 0, width, height)
    .fill(SKY)
    .rect(0, HORIZON, width, height - HORIZON)
    .fill(SAND);

  peak(land, 400, HORIZON, 24, 120, DARK_SAND, 4);

  for (let index = 0; index < 30; index++) {
    land.rect((index * 113) % width, HORIZON + 10 + ((index * 41) % 130), 6, 4).fill(DARK_SAND);
  }

  const tent = new Graphics()
    .rect(58, 124, 90, 8)
    .fill(STONE)
    .rect(64, 132, 6, 26)
    .fill(STEEL)
    .rect(136, 132, 6, 26)
    .fill(STEEL);
  const beam = new Graphics();
  const drone = piece(DRONE, 4);
  const figures = new Container();

  figures.addChild(piece(FIGURE, 7, FIGURES_LEFT + 10, 72), piece(WALKER, 8, FIGURES_LEFT + 150, 96));

  const cover = new Graphics().rect(0, 0, 1, height).fill(0xffffff);

  cover.x = FIGURES_LEFT;
  figures.mask = cover;
  figures.visible = done;
  drone.pivot.set(32, 10);

  scene.addChild(land, figures, cover, tent, flagPole(JAPANESE_FLAG, 4, 102, 124, 40), beam, drone);

  play(
    scene,
    (elapsed) => {
      const sweep = done && elapsed < REVEAL_MS
        ? clamp01(elapsed / REVEAL_MS)
        : (Math.sin(elapsed / 1400) + 1) / 2;
      const x = FIGURES_LEFT + sweep * FIGURES_WIDTH;
      const y = 26 + Math.sin(elapsed / 400) * 3;

      drone.position.set(x, y);
      beam
        .clear()
        .poly([x - 6, y + 10, x + 6, y + 10, x + 44, height, x - 44, height])
        .fill({ color: GOLD, alpha: 0.28 });
      cover.scale.x = FIGURES_WIDTH * clamp01(elapsed / REVEAL_MS) + 44;
    },
    REVEAL_MS,
  );

  return scene;
}
