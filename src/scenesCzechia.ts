import { Container, Graphics } from 'pixi.js';
import { COUNTRY_LANDMARKS, COUNTRY_THINGS } from './countryArt';
import { createLlama, LLAMA } from './logo';
import { clamp01, popScale } from './motion';
import { centredPiece, PERU_FLAG, piece, play, SCENE_COLORS } from './sceneKit';

const [, SHOE, BOWL, , POTATO] = COUNTRY_THINGS.czechia;
const { S: STEEL, W: PALE, Y: GOLD, K: BARK, G: LEAF, C: CRUST } = SCENE_COLORS;

/** C2. A Zlín factory: leather pieces ride the belt, the press stamps them into shoes, and they drop into a box for Peru. */
export function createShoeFactory(width: number, height: number): Container {
  const scene = new Container();
  const BELT_TOP = 136;
  const BELT_END = 456;
  const PRESS_X = 230;
  const SHOE_CELL = 4;
  const SHOE_WIDTH = SHOE[0].length * SHOE_CELL;
  const SHOE_HEIGHT = SHOE.length * SHOE_CELL;
  const SPACING = 150;
  const SPEED = 0.12;
  const room = new Graphics().rect(0, 0, width, height).fill(0x35576b);

  for (let x = 150; x < width; x += 110) {
    room.rect(x, 18, 70, 44).fill(0x8fd3e8).rect(x + 33, 18, 4, 44).fill(0x35576b);
  }

  room.rect(0, 166, width, height - 166).fill(0x26303a);

  const belt = new Graphics().rect(0, BELT_TOP, BELT_END, 14).fill(0x23201f);

  for (let x = 20; x < BELT_END; x += 70) {
    belt.rect(x, BELT_TOP + 14, 10, 16).fill(STEEL);
  }

  const ticks = new Graphics();
  const leather = SHOE.map((row) => row.replace(/[KY]/g, 'T'));
  const shoes = [0, 1, 2, 3].map(() => {
    const shoe = new Container();
    const blank = shoe.addChild(piece(leather, SHOE_CELL));
    const made = shoe.addChild(piece(SHOE, SHOE_CELL));

    shoe.y = BELT_TOP - SHOE_HEIGHT;

    return { shoe, blank, made };
  });
  const frame = new Graphics()
    .rect(PRESS_X - 56, 0, 112, 12)
    .fill(STEEL)
    .rect(PRESS_X - 56, 0, 10, BELT_TOP)
    .fill(STEEL)
    .rect(PRESS_X + 46, 0, 10, BELT_TOP)
    .fill(STEEL);
  const head = new Graphics()
    .rect(PRESS_X - 8, -80, 16, 80)
    .fill(STEEL)
    .rect(PRESS_X - 36, 0, 72, 16)
    .fill(GOLD);
  const box = new Container();

  box.position.set(BELT_END - 10, 102);
  box.addChild(piece(PERU_FLAG, 12), new Graphics().rect(-4, 0, 80, 6).fill(BARK));

  scene.addChild(room, belt, ticks);
  shoes.forEach(({ shoe }) => scene.addChild(shoe));
  scene.addChild(frame, head, box);

  const span = SPACING * shoes.length;

  play(
    scene,
    (elapsed) => {
      let nearest = SPACING;

      shoes.forEach(({ shoe, blank, made }, index) => {
        shoe.x = ((elapsed * SPEED + index * SPACING) % span) - SHOE_WIDTH;

        const stamped = shoe.x + SHOE_WIDTH / 2 > PRESS_X;

        // Gone into the box, so it must not come out of the far side.
        shoe.visible = shoe.x < BELT_END - 10;

        blank.visible = !stamped;
        made.visible = stamped;
        nearest = Math.min(nearest, Math.abs(shoe.x + SHOE_WIDTH / 2 - PRESS_X));
      });
      head.y = BELT_TOP - SHOE_HEIGHT - 16 - 56 * clamp01(nearest / 44);

      ticks.clear();

      for (let x = (elapsed * SPEED) % 30; x < BELT_END; x += 30) {
        ticks.rect(x, BELT_TOP + 5, 12, 4).fill(STEEL);
      }
    },
    4000,
  );

  return scene;
}

const DOG_BODY = [
  '..KKKKKKKKKKK.',
  '.KKKKKKKKKKKKK',
  '.KKKKWWKKKKKKK',
  '.KKKKKKKKKKKKK',
  '..KK.....KK...',
  '..KK.....KK...',
  '..BB.....BB...',
];
const DOG_HEAD = ['.BB.....', 'BBKKKK..', 'BKKBKKKK', '.KKKKKKB', '..KKKKW.'];
const FOOD_BAG = ['SSSSSSSS', 'SYYYYYYS', 'SYRRRRYS', 'SYYYYYYS', 'SYYYYYYS', 'SSSSSSSS'];

/** C3. Brit for dinner: kibble pours from a bag into the bowl while a dog eats and wags its tail. */
export function createDogDinner(width: number, height: number): Container {
  const scene = new Container();
  const FLOOR = 156;
  const BOWL_CELL = 6;
  const BOWL_X = width / 2 + 20;
  const BOWL_WIDTH = BOWL[0].length * BOWL_CELL;
  const RIM = FLOOR - 6 * BOWL_CELL;
  const DOG_CELL = 6;
  const DOG_X = BOWL_X - 112;
  const BODY_TOP = FLOOR - DOG_BODY.length * DOG_CELL;
  const BAG_X = BOWL_X + BOWL_WIDTH + 30;
  const BAG_Y = 46;
  const BAG_TURN = -2.2;
  const MOUTH_X = BAG_X + Math.sin(BAG_TURN) * 24;
  const MOUTH_Y = BAG_Y - Math.cos(BAG_TURN) * 24;
  const room = new Graphics().rect(0, 0, width, height).fill(0x4f6d8f);

  for (let x = 0; x < width; x += 40) {
    room.rect(x, 0, 20, FLOOR).fill(0x587aa0);
  }

  room.rect(0, FLOOR, width, height - FLOOR).fill(0x8b5a32);

  for (let x = 0; x < width; x += 90) {
    room.rect(x, FLOOR + 14, 60, 4).fill(BARK);
  }

  const body = piece(DOG_BODY, DOG_CELL, DOG_X, BODY_TOP);
  const head = piece(DOG_HEAD, DOG_CELL);
  const tail = new Graphics().rect(-3, -24, 6, 24).fill(BARK);
  const bowl = piece(BOWL, BOWL_CELL, BOWL_X, FLOOR - BOWL.length * BOWL_CELL);
  const bag = centredPiece(FOOD_BAG, 8, BAG_X, BAG_Y);
  const kibble = Array.from({ length: 6 }, () => new Graphics().rect(-3, -3, 6, 6).fill(CRUST));

  tail.position.set(DOG_X + 2 * DOG_CELL, BODY_TOP + 6);
  bag.rotation = BAG_TURN;
  scene.addChild(room, tail, body, head, ...kibble, bowl, bag);

  play(
    scene,
    (elapsed) => {
      const eat = (Math.sin(elapsed / 260) + 1) / 2;

      head.position.set(DOG_X + 66 + 14 * eat, BODY_TOP - 24 + 28 * eat);
      tail.rotation = -0.6 + 0.4 * Math.sin(elapsed / 110);
      bag.rotation = BAG_TURN + 0.06 * Math.sin(elapsed / 400);
      kibble.forEach((bit, index) => {
        const fall = (elapsed / 900 + index / kibble.length) % 1;

        bit.position.set(MOUTH_X + (BOWL_X + BOWL_WIDTH * 0.6 - MOUTH_X) * fall, MOUTH_Y + (RIM - MOUTH_Y) * fall * fall);
      });
    },
    0,
  );

  return scene;
}

const CUSCO_CATHEDRAL = [
  '...Y...............Y...',
  '...T...............T...',
  '..TTT.............TTT..',
  '..TIT.............TIT..',
  '..TTT.....Y.......TTT..',
  '..TIT...TTTTT.....TIT..',
  '..TTTTTTTTTTTTTTTTTTT..',
  '..TTTTTTTKKKTTTTTTTTT..',
  '..TIITTTKKKKKTTTTIITT..',
  '..TIITTTKKKKKTTTTIITT..',
  '..TTTTTTKKKKKTTTTTTTT..',
  'SNSSNSSSNSSSSNSSNSSNSSN',
  'SSNSSSNSSSNSSNSSSNSSSNS',
];
const SEAL = [
  '....YYYY....',
  '..YYYYYYYY..',
  '.YYYYWWYYYY.',
  '.YYYYWWYYYY.',
  'YYWWWWWWWWYY',
  'YYYWWWWWWYYY',
  'YYYYWWWWYYYY',
  'YYYWWYYWWYYY',
  '.YYWYYYYWYY.',
  '.YYYYYYYYYY.',
  '..YYYYYYYY..',
  '....YYYY....',
];

/** C4. Prague and Cusco side by side, with one golden seal swinging between them. */
export function createSharedSeal(width: number, height: number): Container {
  const scene = new Container();
  const GROUND = 160;
  const room = new Graphics().rect(0, 0, width, height).fill(0x2b3a7a).rect(0, GROUND, width, height - GROUND).fill(LEAF);
  const prague = COUNTRY_LANDMARKS.czechia;
  const left = piece(prague.rows, 5, 60, GROUND - prague.rows.length * 5);
  const right = piece(CUSCO_CATHEDRAL, 6, width - CUSCO_CATHEDRAL[0].length * 6 - 58, GROUND - CUSCO_CATHEDRAL.length * 6);
  const seal = new Container();
  const ribbon = new Graphics().rect(-4, 0, 8, 60).fill(0xe2452f);

  seal.position.set(width / 2, 0);
  seal.addChild(ribbon, piece(SEAL, 6, -36, 56));

  const sparkles = Array.from({ length: 14 }, (_, index) => {
    const spark = new Graphics().rect(-3, -3, 6, 6).fill(index % 3 ? PALE : GOLD);

    spark.position.set(170 + ((index * 83) % 240), 14 + ((index * 47) % 130));

    return spark;
  });

  scene.addChild(room, ...sparkles, left, right, seal);

  play(
    scene,
    (elapsed) => {
      seal.rotation = Math.sin(elapsed / 700) * 0.16;
      sparkles.forEach((spark, index) => {
        spark.alpha = Math.max(0, Math.sin(elapsed / 300 + index * 1.7));
      });
    },
    0,
  );

  return scene;
}

const PANCAKE = [
  '...CCCCCCCCCCCCCC...',
  '.CCYYCCYYYYCCYYYCCC.',
  'CYYYYYYCCYYYYYYCYYYC',
  '.CCCYYYYYCCYYYCCCCC.',
  '...CCCCCCCCCCCCCC...',
];

/** C5. A bramborák flips and sizzles in the pan. The potatoes only arrive after the answer, since they are the answer. */
export function createPancakePan(width: number, height: number, done: boolean): Container {
  const scene = new Container();
  const STOVE_TOP = 150;
  const PAN_X = width / 2;
  const PAN_TOP = STOVE_TOP - 22;
  const CAKE_REST = PAN_TOP - 12;
  const FLIP_MS = 1100;
  const FLIP_EVERY_MS = 3000;
  const FLIP_HEIGHT = 80;
  const wall = new Graphics().rect(0, 0, width, height).fill(0x7fb3ad);

  for (let x = 0; x < width; x += 48) {
    wall.rect(x, 0, 2, STOVE_TOP).fill(0x6a9c96);
  }

  for (let y = 0; y < STOVE_TOP; y += 48) {
    wall.rect(0, y, width, 2).fill(0x6a9c96);
  }

  wall.rect(0, STOVE_TOP, width, height - STOVE_TOP).fill(0x4b5468);

  const flames = new Graphics();
  const pan = new Graphics()
    .rect(PAN_X - 80, PAN_TOP, 160, 14)
    .fill(0x23201f)
    .rect(PAN_X - 70, PAN_TOP + 14, 140, 6)
    .fill(0x23201f)
    .rect(PAN_X - 146, PAN_TOP + 2, 66, 8)
    .fill(BARK);
  const cake = centredPiece(PANCAKE, 6, PAN_X, CAKE_REST);
  const sizzles = Array.from({ length: 8 }, (_, index) => {
    const sizzle = new Graphics().rect(-2, -2, 4, 4).fill(0xffffff);

    sizzle.x = PAN_X - 70 + index * 20;

    return sizzle;
  });
  const llama = createLlama(3);

  llama.position.set(56, STOVE_TOP - LLAMA.length * 3);
  scene.addChild(wall, llama, flames, pan, cake, ...sizzles);

  const potatoes = done
    ? [
        [430, STOVE_TOP - 14],
        [494, STOVE_TOP - 14],
        [462, STOVE_TOP - 40],
      ].map(([x, y]) => scene.addChild(centredPiece(POTATO, 4, x, y)))
    : [];

  play(
    scene,
    (elapsed) => {
      const flip = clamp01((elapsed % FLIP_EVERY_MS) / FLIP_MS);

      cake.y = CAKE_REST - Math.sin(flip * Math.PI) * FLIP_HEIGHT;
      cake.scale.y = Math.cos(flip * Math.PI * 2);

      flames.clear();

      for (let x = PAN_X - 60; x < PAN_X + 60; x += 20) {
        const flame = 4 + ((Math.floor(elapsed / 120) + x) % 3) * 2;

        flames.rect(x, PAN_TOP + 20, 12, flame).fill(0xf08a3c);
      }

      sizzles.forEach((sizzle, index) => {
        const rise = (elapsed / 700 + index * 0.37) % 1;

        sizzle.y = PAN_TOP - 4 - rise * 26;
        sizzle.alpha = 1 - rise;
      });
      potatoes.forEach((potato, index) => {
        potato.scale.set(popScale(clamp01((elapsed - 200 - index * 250) / 400)));
      });
    },
    1000 + FLIP_MS,
  );

  return scene;
}
