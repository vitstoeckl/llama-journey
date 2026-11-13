import { Container, Graphics, Ticker } from 'pixi.js';
import { ALPACA, CELL, CONTENT_WIDTH, INDIGO, MAIZE } from './theme';
import { weave } from './woven';

export const LLAMA = [
  '....................WW.WW...',
  '....................WW.WW...',
  '...................WWWWWW...',
  '...................WWIWWWWW.',
  '...................WWWWWWWWW',
  '...................WWWWWWWW.',
  '...................WWWWD....',
  '...................WWWWD....',
  '...................WWWWD....',
  '...................WWWWD....',
  '..WW...............WWWWD....',
  '.WWWWWWWWWWWWWWWWWWWWWWD....',
  '.WWMMMMMMMMMMMMMWWWWWWDD....',
  '.WWMYMYMYMYMYMYMWWWWWDD.....',
  '..WMMMMMMMMMMMMMWWWWDD......',
  '...WWWWWWWWWWWWWWWDDD.......',
  '...DDD.WWW.....DDD.WWW......',
  '...DDD.WWW.....DDD.WWW......',
  '...DD..WW......DD..WW.......',
  '...DD..WW......DD..WW.......',
];

export const LLAMA_COLORS = { W: ALPACA, D: 0xe0c9a3, I: INDIGO, M: INDIGO, Y: MAIZE };

const GLYPHS: Record<string, string[]> = {
  L: ['XX....', 'XX....', 'XX....', 'XX....', 'XX....', 'XX....', 'XXXXXX', 'XXXXXX'],
  A: ['..XX..', '.XXXX.', 'XX..XX', 'XX..XX', 'XXXXXX', 'XXXXXX', 'XX..XX', 'XX..XX'],
  M: ['XX....XX', 'XXX..XXX', 'XXXXXXXX', 'XX.XX.XX', 'XX.XX.XX', 'XX....XX', 'XX....XX', 'XX....XX'],
  "'": ['.XX.', '.XX.', '..X.', '....', '....', '....', '....', '....'],
  S: ['.XXXXX', 'XXXXXX', 'XX....', 'XXXXX.', '.XXXXX', '....XX', 'XXXXXX', 'XXXXX.'],
  J: ['...XX', '...XX', '...XX', '...XX', '...XX', 'XX.XX', 'XXXXX', '.XXX.'],
  O: ['.XXXX.', 'XXXXXX', 'XX..XX', 'XX..XX', 'XX..XX', 'XX..XX', 'XXXXXX', '.XXXX.'],
  U: ['XX..XX', 'XX..XX', 'XX..XX', 'XX..XX', 'XX..XX', 'XX..XX', 'XXXXXX', '.XXXX.'],
  R: ['XXXXX.', 'XXXXXX', 'XX..XX', 'XXXXXX', 'XXXXX.', 'XX.XX.', 'XX..XX', 'XX..XX'],
  N: ['XX...XX', 'XX...XX', 'XXX..XX', 'XXXX.XX', 'XX.XXXX', 'XX..XXX', 'XX...XX', 'XX...XX'],
  E: ['XXXXXX', 'XXXXXX', 'XX....', 'XXXXX.', 'XXXXX.', 'XX....', 'XXXXXX', 'XXXXXX'],
  Y: ['XX..XX', 'XX..XX', 'XX..XX', '.XXXX.', '..XX..', '..XX..', '..XX..', '..XX..'],
};

/** Lima's cathedral, on the Plaza Mayor. */
const LIMA_CATHEDRAL = [
  '...X.............X...',
  '..XXX...........XXX..',
  '..XXX...........XXX..',
  '.XXXXX.........XXXXX.',
  '.X.X.X.........X.X.X.',
  '.XXXXX....X....XXXXX.',
  '.X.X.X..XXXXX..X.X.X.',
  '.XXXXXXXXXXXXXXXXXXX.',
  '.XXXXXXX.XXX.XXXXXXX.',
  '.XXXXXXXXXXXXXXXXXXX.',
  '.XX.XXXXX...XXXXX.XX.',
  '.XX.XXXX.....XXXX.XX.',
  'XXXXXXXX.....XXXXXXXX',
];
/** The twin spires of Prague's Týn Church. */
const TYN_CHURCH = [
  '...X.......X...',
  '...X.......X...',
  '..XXX.....XXX..',
  '..XXX.....XXX..',
  '.XXXXX...XXXXX.',
  'X.XXX.X.X.XXX.X',
  'XXXXXXX.XXXXXXX',
  '.XX.XX...XX.XX.',
  '.XXXXX.X.XXXXX.',
  '.XX.XXXXXXX.XX.',
  '.XXXXXXXXXXXXX.',
  '.XXXXX...XXXXX.',
  '.XXXXX...XXXXX.',
];
const GATE_COLUMNS = 'XX..XX..XX...XX..XX..XX';
/** Berlin's Brandenburg Gate. */
const BRANDENBURG_GATE = [
  '.........XXXXX.........',
  '..........XXX..........',
  '.......XXXXXXXXX.......',
  '...XXXXXXXXXXXXXXXXX...',
  '.XXXXXXXXXXXXXXXXXXXXX.',
  'XXXXXXXXXXXXXXXXXXXXXXX',
  ...Array<string>(6).fill(GATE_COLUMNS),
  'XXXXXXXXXXXXXXXXXXXXXXX',
];
const TOKYO_TOWER = [
  '.......X.......',
  '.......X.......',
  '.......X.......',
  '......XXX......',
  '.....XXXXX.....',
  '......XXX......',
  '......X.X......',
  '.....XX.XX.....',
  '...XXXXXXXXX...',
  '....XX...XX....',
  '...XX.X.X.XX...',
  '..XX..XXX..XX..',
  '.XX...X.X...XX.',
];
/** Each stop's landmark, in route order. */
const STOP_LANDMARKS = [LIMA_CATHEDRAL, TYN_CHURCH, BRANDENBURG_GATE, TOKYO_TOWER];
const LANDMARK_CELL = 4;
const LANDMARK_GAP = 4;
const LANDMARK_HEIGHT = LIMA_CATHEDRAL.length * LANDMARK_CELL;
const ROUTE_COLUMNS = CONTENT_WIDTH / CELL;
const STOP_COLUMNS = [6, 18, 30, 42];

/** Where each stop sits across the route: Lima, Prague, Berlin, Tokyo. */
export const ROUTE_STOPS = STOP_COLUMNS.map((column) => (column + 0.5) * CELL);
/** Height of the route's line and the landmarks below it. */
export const ROUTE_HEIGHT = CELL + LANDMARK_GAP + LANDMARK_HEIGHT;
/** Height of the llama standing on its route. */
export const SCENE_HEIGHT = LLAMA.length * CELL + ROUTE_HEIGHT;

/** Spells a word in the woven alphabet, with one empty column between letters. */
function spell(word: string): string[] {
  return GLYPHS[word[0]].map((_, row) => [...word].map((letter) => GLYPHS[letter][row]).join('.'));
}

// Only the width the legs fill, so the lowered head can sit right beside them.
const LLAMA_LEGS = LLAMA.slice(16).map((row) => row.slice(0, 22));
const LLAMA_BENDING = [
  ...Array<string>(5).fill(''),
  '........................WW.WW',
  '........................WW.WW',
  '.......................WWWWWW',
  '......................WWWWIWWWWW',
  '.....................WWWWWWWWWWWW',
  '..WW................WWWWWWWWWWWW',
  '.WWWWWWWWWWWWWWWWWWWWWWWD',
  ...LLAMA.slice(12),
];
const LLAMA_HEAD_DOWN = [
  ...Array<string>(10).fill(''),
  '..WW',
  '.WWWWWWWWWWWWWWWWWWWWWWD',
  '.WWMMMMMMMMMMMMMWWWWWWWWD',
  '.WWMYMYMYMYMYMYMWWWWWWWWWD',
  '..WMMMMMMMMMMMMMWWWWDDWWWWD.WW.WW',
  '...WWWWWWWWWWWWWWWDDD.DWWWWDWW.WW',
];
const LLAMA_CHEWING_OPEN = [
  ...LLAMA_HEAD_DOWN,
  LLAMA_LEGS[0] + '..DWWWWWWWW',
  LLAMA_LEGS[1] + '...DWWIWWWWW',
  LLAMA_LEGS[2] + '....WWWWWWWWWW',
  LLAMA_LEGS[3] + '.....WWWWWW',
];
const LLAMA_CHEWING_SHUT = [
  ...LLAMA_HEAD_DOWN,
  LLAMA_LEGS[0] + '..DWWWWWWWW',
  LLAMA_LEGS[1] + '...DWWIWWWWW',
  LLAMA_LEGS[2] + '....WWWWWWWWW',
  LLAMA_LEGS[3] + '.....WWWWWWWWW',
];
const GRASS = [
  '.G...G..G.',
  '.G.G.G..G.',
  'GG.G.GG.GG',
  '.GGG..GGG.',
  '..GGGGGGG.',
  '.GGGGGGGGG',
];
const GRASS_GREEN = 0x57b35f;
/** How far right of the scene's left edge the llama stands, in cells. */
const LLAMA_COLUMN = 3;
const GRASS_COLUMN = 34 + LLAMA_COLUMN;
const GRASS_ROW = LLAMA.length - GRASS.length;

const POSE_BENDING = 1;
const POSE_CHEWING_OPEN = 2;
const POSE_CHEWING_SHUT = 3;
const CHEW_MS = 240;
const CHEW = [
  { pose: POSE_CHEWING_OPEN, ms: CHEW_MS },
  { pose: POSE_CHEWING_SHUT, ms: CHEW_MS },
];
/** Head up for a look around, down for six bites, and back up. */
const GRAZE_STEPS = [
  { pose: 0, ms: 1800 },
  { pose: POSE_BENDING, ms: 150 },
  ...Array.from({ length: 6 }, () => CHEW).flat(),
  { pose: POSE_BENDING, ms: 150 },
];
const GRAZE_LENGTH = GRAZE_STEPS.reduce((total, { ms }) => total + ms, 0);

/** The line from Lima to Tokyo, with each stop's landmark below it. Stops reached so far are gold. */
export function createRoute(reached: readonly number[]): Container {
  const route = new Container();

  route.addChild(weave(new Graphics(), ['X'.repeat(ROUTE_COLUMNS)], { X: MAIZE }));

  STOP_LANDMARKS.forEach((landmark, stop) => {
    route.addChild(
      weave(
        new Graphics(),
        landmark,
        { X: reached.includes(stop) ? MAIZE : ALPACA },
        ROUTE_STOPS[stop] - (landmark[0].length * LANDMARK_CELL) / 2,
        CELL + LANDMARK_GAP,
        LANDMARK_CELL,
      ),
    );
  });

  return route;
}

export function createLlama(cell = CELL): Graphics {
  return weave(new Graphics(), LLAMA, LLAMA_COLORS, 0, 0, cell);
}

/** The llama grazing at the start of its route, 48 cells wide and SCENE_HEIGHT tall. */
export function createScene(): Container {
  const scene = new Container();
  const route = createRoute([0]);
  const poses = [LLAMA, LLAMA_BENDING, LLAMA_CHEWING_OPEN, LLAMA_CHEWING_SHUT].map((rows) =>
    weave(new Graphics(), rows, LLAMA_COLORS, LLAMA_COLUMN * CELL),
  );
  const show = (pose: number) => poses.forEach((drawn, index) => (drawn.visible = index === pose));

  route.y = LLAMA.length * CELL;
  scene.addChild(...poses, weave(new Graphics(), GRASS, { G: GRASS_GREEN }, GRASS_COLUMN * CELL, GRASS_ROW * CELL), route);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    show(POSE_CHEWING_SHUT);

    return scene;
  }

  let elapsed = 0;
  const update = (ticker: Ticker) => {
    elapsed = (elapsed + ticker.deltaMS) % GRAZE_LENGTH;

    let time = elapsed;
    const step = GRAZE_STEPS.find(({ ms }) => (time -= ms) < 0);

    show(step ? step.pose : 0);
  };

  show(0);
  Ticker.shared.add(update);
  scene.once('destroyed', () => Ticker.shared.remove(update));

  return scene;
}

/** The full logo, 48 cells wide: the llama on its route above the woven name. */
export function createLogo(): Container {
  const logo = new Container();
  const firstLine = spell("LLAMA'S");
  const top = SCENE_HEIGHT + CELL;

  logo.addChild(
    createScene(),
    weave(new Graphics(), firstLine, { X: ALPACA }, 0, top),
    weave(new Graphics(), spell('JOURNEY'), { X: MAIZE }, 0, top + (firstLine.length + 1) * CELL),
  );

  return logo;
}
