import { COUNTRY_LANDMARKS, COUNTRY_THINGS, ART_COLORS } from './countryArt';
import { CUY, CUY_COLORS, css } from './cuyArt';
import { LLAMA, LLAMA_COLORS } from './logo';
import { SCENE_COLORS } from './sceneKit';
import { MACHU_PICCHU } from './scenesJapan';
import { ALPACA, CHILCA, COCHINEAL, INDIGO, MADDER, MAIZE } from './theme';

/**
 * The cuy's secret story: clicking the cuy beside the home page five times plays a
 * two-and-a-half-minute animation. The wind steals Cuyo's chullo, and he chases it through
 * Prague, Berlin and Tokyo, up Mount Fuji, and flies home with the llama.
 * Fifteen scenes of ten seconds, drawn on a canvas in the game's pixel style, with a caption under each.
 */

const W = 960;
const H = 540;
const GROUND = 430;
const SCENE_SECONDS = 10;

const CAPTIONS = [
  'En lo alto de los Andes vive Cuyo, un cuy muy curioso. Su abuela le tejió un chullo especial.',
  'Pero un día sopla un viento fortísimo… ¡y se lleva el chullo por los aires!',
  'El chullo cae en la maleta de la llama, que se va a dar la vuelta al mundo. ¡Cuyo salta tras él!',
  '¡A volar! Cuyo cruza el océano de polizón, abrazado a su chullo.',
  'Primera parada: Praga. Del hambre prueba el bramborák… ¡de papa, como en el Perú!',
  'Pero una paloma traviesa le roba el chullo… ¡y se va volando hacia Alemania!',
  'En Berlín, Cuyo persigue a la paloma por la autopista… ¡más rápido que los autos!',
  'La paloma suelta el chullo dentro de un paquete para Tokio. ¡Cuyo se mete también!',
  'Toda la noche viaja escondido en un avión de carga, sobre Europa y Asia.',
  '¡En Tokio tiembla la tierra! Japón, como el Perú, está donde chocan las placas tectónicas.',
  'Del susto le da hambre. Prueba el sushi… ¡rico! Pero extraña su ceviche.',
  'Por fin ve su chullo… ¡en la cima del Monte Fuji! A escalar, Cuyo.',
  '¡Lo encontró! Y desde el cielo llega volando una amiga conocida…',
  'La llama y Cuyo vuelan juntos de regreso al Perú.',
  'En casa lo espera la abuela con un ceviche gigante. ¡Fiesta en los Andes! Fin.',
];

type Colors = Record<string, string>;
type Ctx = CanvasRenderingContext2D;

const toCss = (colors: Record<string, number>): Colors =>
  Object.fromEntries(Object.entries(colors).map(([key, value]) => [key, css(value)]));

const ART = toCss(ART_COLORS);
const LLAMA_CSS = toCss(LLAMA_COLORS);
const RUINS_CSS = toCss(SCENE_COLORS);
const SKY = '#9fd6ea';
const NIGHT = css(INDIGO);
const GRASS = '#57b35f';
const SEA = '#2f7fc1';
const SUNSET = '#f7b267';
const FONT = '"Segoe UI", system-ui, sans-serif';

/** The chullo on its own: the top of the cuy pattern. Drawn at the stand x of a cuy, it sits on its head. */
const CHULLO = CUY.slice(0, 6).map((row) => row.slice(13, 22));
/** Cuyo without his chullo, with two pink ears. */
const BARE_CUY = CUY.map((row, r) => {
  if (r === 5) return '................PP..PP....';

  return [...row].map((cell, c) => ('RYI'.includes(cell) ? (r >= 6 && c < 16 ? 'B' : '.') : cell)).join('');
});
const GRANNY_COLORS: Colors = { ...CUY_COLORS, B: '#b3a89c' };

const SUITCASE = [
  '....KKKK....',
  '....K..K....',
  'CCCCCCCCCCCC',
  'CYYCCCCCCYYC',
  'CCCCCCCCCCCC',
  'CCCCCYYCCCCC',
  'CCCCCCCCCCCC',
  'CYYCCCCCCYYC',
  'CCCCCCCCCCCC',
];
const SUITCASE_COLORS: Colors = { C: css(COCHINEAL), Y: css(MAIZE), K: css(MADDER) };
const WING = ['WWW...', 'WWWWW.', '.WWWWW'];
const HEART = ['.RR.RR.', 'RRRRRRR', 'RRRRRRR', '.RRRRR.', '..RRR..', '...R...'];
/** Two pieces of salmon nigiri on a wooden board. */
const SUSHI = [
  '.SSSSS.....SSSSS.',
  'SLSSLSS...SLSSLSS',
  'SSLSSLS...SSLSSLS',
  '.WNNNW.....WNNNW.',
  'WWNNNWW...WWNNNWW',
  'WWWWWWW...WWWWWWW',
  'TTTTTTTTTTTTTTTTT',
  '.TTTTTTTTTTTTTTT.',
];
const SUSHI_COLORS: Colors = { S: '#f08a5c', L: '#ffd2b8', W: '#ffffff', N: '#23201f', T: '#b9762f' };
const CLOUD = ['...WWWW....', '.WWWWWWWW..', 'WWWWWWWWWWW', '.WWWWWWWWW.'];
/** A pigeon facing right, wings up and wings down. */
const PIGEON = [
  [
    '...WW......',
    '..WWWW.....',
    '...WWWW.GG.',
    '....GGGGEGO',
    '.GGGGGGGGG.',
    'GGGGGGGGG..',
    '....O..O...',
  ],
  [
    '...........',
    '........GG.',
    '....GGGGEGO',
    '.GGGGGGGGG.',
    'GGGWWWWGG..',
    '...WWWW....',
    '....O..O...',
  ],
];
const PIGEON_COLORS: Colors = { G: '#8d93a6', W: '#c9cedb', E: '#23201f', O: '#f08a3c' };

function draw(ctx: Ctx, rows: readonly string[], colors: Colors, cell: number, x: number, y: number, flip = false): void {
  const width = rows[0].length;

  rows.forEach((row, r) => {
    for (let c = 0; c < width; c++) {
      const fill = colors[row[c]];

      if (fill) {
        ctx.fillStyle = fill;
        ctx.fillRect(Math.round(x + (flip ? width - 1 - c : c) * cell), Math.round(y + r * cell), cell, cell);
      }
    }
  });
}

/** Draws a pattern with its bottom-centre at (x, y). */
function stand(ctx: Ctx, rows: readonly string[], colors: Colors, cell: number, x: number, y: number, flip = false): void {
  draw(ctx, rows, colors, cell, x - (rows[0].length * cell) / 2, y - rows.length * cell, flip);
}

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => 0.5 - Math.cos(clamp(value) * Math.PI) / 2;
const hop = (time: number, every = 0.5, height = 14) => Math.abs(Math.sin((time / every) * Math.PI)) * height;
const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;

const cuy = (ctx: Ctx, x: number, y: number, cell = 8, flip = false) => stand(ctx, CUY, CUY_COLORS, cell, x, y, flip);
const bareCuy = (ctx: Ctx, x: number, y: number, cell = 8, flip = false) => stand(ctx, BARE_CUY, CUY_COLORS, cell, x, y, flip);
/** The chullo with its top-left at (x, y). */
const chullo = (ctx: Ctx, x: number, y: number, cell = 8) => draw(ctx, CHULLO, CUY_COLORS, cell, x, y);
const heart = (ctx: Ctx, x: number, y: number) => stand(ctx, HEART, { R: css(COCHINEAL) }, 6, x, y);

function pigeon(ctx: Ctx, x: number, y: number, t: number, flip = false): void {
  draw(ctx, PIGEON[Math.sin(t * 16) > 0 ? 0 : 1], PIGEON_COLORS, 7, x - 38, y - 25, flip);
}

/** A speech bubble whose tail points down at (x, y). */
function say(ctx: Ctx, text: string, x: number, y: number): void {
  ctx.font = `800 26px ${FONT}`;

  const width = ctx.measureText(text).width + 32;
  const height = 48;
  const left = Math.max(8, Math.min(W - width - 8, x - width / 2));
  const top = y - height - 18;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(left, top, width, height);
  ctx.fillRect(x - 8, top + height, 16, 8);
  ctx.fillRect(x - 4, top + height + 8, 8, 8);
  ctx.fillStyle = NIGHT;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, left + 16, top + height / 2 + 1);
  ctx.textBaseline = 'alphabetic';
}

/** Says something between two moments of the scene. */
function sayDuring(ctx: Ctx, t: number, from: number, to: number, text: string, x: number, y: number): void {
  if (t >= from && t < to) say(ctx, text, x, y);
}

function backdrop(ctx: Ctx, sky: string, ground = GRASS): void {
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = ground;
  ctx.fillRect(0, GROUND, W, H - GROUND);
  ctx.fillStyle = css(MAIZE);
  ctx.fillRect(0, GROUND, W, 8);
}

/** Stepped pixel mountains with snowy tops. */
function mountains(ctx: Ctx): void {
  const peaks = [
    { x: 160, h: 230, color: css(CHILCA) },
    { x: 470, h: 300, color: '#2f8a58' },
    { x: 780, h: 250, color: css(CHILCA) },
  ];
  const step = 10;

  for (const { x, h, color } of peaks) {
    for (let row = 0; row * step < h; row++) {
      const half = row * step * 1.1;
      const y = GROUND - h + row * step;

      ctx.fillStyle = row < 5 ? css(ALPACA) : color;
      ctx.fillRect(x - half, y, half * 2 + step, step);
    }
  }

  ctx.fillStyle = GRASS;
  ctx.fillRect(0, GROUND, W, H - GROUND);
  ctx.fillStyle = css(MAIZE);
  ctx.fillRect(0, GROUND, W, 8);
}

const FUJI_X = 480;
const FUJI_TOP = 110;
const FUJI_STEP = 10;
const FUJI_ROWS = (GROUND - FUJI_TOP) / FUJI_STEP;
/** Where Cuyo stands on the summit in the sunset scene. */
const SUMMIT_X = 640;
const SUMMIT_Y = 320;
/** Half the width of Mount Fuji at a row of its steps. */
const fujiHalf = (row: number) => 50 + row * 15;

/** Mount Fuji, big, with its snowy cap. */
function fuji(ctx: Ctx): void {
  for (let row = 0; row < FUJI_ROWS; row++) {
    const half = fujiHalf(row);
    const y = FUJI_TOP + row * FUJI_STEP;

    ctx.fillStyle = row < 8 ? '#ffffff' : '#4f6a9a';
    ctx.fillRect(FUJI_X - half, y, half * 2, FUJI_STEP);

    // The snow runs down the slope in teeth.
    if (row >= 8 && row < 11) {
      ctx.fillStyle = '#ffffff';
      for (let x = FUJI_X - half + 10; x < FUJI_X + half - 20; x += 44) ctx.fillRect(x, y, 22 - (row - 8) * 7, FUJI_STEP);
    }
  }
}

function clouds(ctx: Ctx, time: number, speed: number, color = '#ffffff'): void {
  [80, 170, 60].forEach((y, index) => {
    const x = ((index * 380 - time * speed) % (W + 200) + W + 200) % (W + 200) - 100;

    draw(ctx, CLOUD, { W: color }, 8, x, y);
  });
}

function stars(ctx: Ctx, t: number): void {
  for (let i = 0; i < 46; i++) {
    const size = Math.sin(t * 3 + i) > 0.3 ? 6 : 4;

    ctx.fillStyle = i % 5 === 0 ? css(MAIZE) : '#ffffff';
    ctx.fillRect((i * 197) % W, (i * 89) % 330, size, size);
  }
}

function landmark(ctx: Ctx, country: 'czechia' | 'germany' | 'japan'): void {
  stand(ctx, COUNTRY_LANDMARKS[country].rows, ART, 10, 700, GROUND);
}

/** Wind streaks blowing to the right. */
function wind(ctx: Ctx, t: number, strength: number): void {
  ctx.globalAlpha = 0.75 * strength;
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 9; i++) {
    const x = ((i * 137 + t * 900) % (W + 200)) - 100;

    ctx.fillRect(x, 50 + i * 40, 90 + (i % 3) * 30, 5);
  }
  ctx.globalAlpha = 1;
}

/** A cardboard box for Tokyo, with its bottom-centre at (x, y). */
function parcel(ctx: Ctx, x: number, y: number, open: boolean): void {
  const width = 170;
  const height = 120;
  const left = x - width / 2;
  const top = y - height;

  ctx.fillStyle = '#b9824a';
  ctx.fillRect(left, top, width, height);
  ctx.fillStyle = '#8f5f30';
  ctx.fillRect(left, top, width, 10);
  ctx.fillStyle = css(MAIZE);
  ctx.fillRect(x - 10, top, 20, height);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x - 60, top + 42, 120, 40);
  ctx.fillStyle = NIGHT;
  ctx.font = `900 28px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText('TOKIO', x, top + 72);
  ctx.textAlign = 'start';

  if (open) {
    ctx.fillStyle = '#a3713c';
    ctx.fillRect(left - 56, top - 12, 66, 12);
    ctx.fillRect(left + width - 10, top - 12, 66, 12);
  }
}

/** A cargo plane facing right, centred at (x, y), with Cuyo looking out of one window. */
function plane(ctx: Ctx, x: number, y: number, t: number): void {
  ctx.fillStyle = '#f2f2f2';
  ctx.fillRect(x - 180, y - 32, 330, 64);
  ctx.fillRect(x + 150, y - 22, 30, 46);
  ctx.fillRect(x + 180, y - 10, 16, 26);
  ctx.fillStyle = css(COCHINEAL);
  ctx.fillRect(x - 180, y - 96, 54, 64);
  ctx.fillRect(x - 180, y + 6, 360, 8);
  ctx.fillStyle = '#c9cedb';
  ctx.fillRect(x - 50, y + 14, 130, 24);
  ctx.fillRect(x - 210, y - 4, 50, 16);

  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = '#ffd86b';
    ctx.fillRect(x - 130 + i * 46, y - 20, 26, 20);
  }

  // Cuyo's face in the fourth window: the front of his head, small.
  ctx.fillStyle = SKY;
  ctx.fillRect(x + 4, y - 26, 40, 30);
  draw(ctx, BARE_CUY.slice(6, 12).map((row) => row.slice(15, 25)), CUY_COLORS, 4, x + 4, y - 26);

  if (Math.sin(t * 6) > 0) {
    ctx.fillStyle = '#ff4d4d';
    ctx.fillRect(x + 76, y + 30, 8, 8);
  }
}

/** The llama with wings, facing right, bottom-centre at (x, y); Cuyo can ride on its back. */
function flyingLlama(ctx: Ctx, x: number, y: number, t: number, rider: boolean): void {
  const cell = 6;
  const flap = Math.sin(t * 12) > 0;

  stand(ctx, LLAMA, LLAMA_CSS, cell, x, y);
  if (rider) cuy(ctx, x - 24, y - 9 * cell, 4);
  draw(ctx, flap ? WING : [...WING].reverse(), { W: '#ffffff' }, 9, x - 66, y - 12 * cell + (flap ? -18 : 6));
}

function fireworks(ctx: Ctx, t: number): void {
  const bursts: [number, number, number, string][] = [
    [200, 110, 0, css(MAIZE)],
    [720, 80, 0.7, css(COCHINEAL)],
    [470, 170, 1.3, '#ffffff'],
  ];

  for (const [cx, cy, delay, color] of bursts) {
    const progress = ((t + delay) % 2) / 2;
    const radius = progress * 110;

    ctx.globalAlpha = 1 - progress;
    ctx.fillStyle = color;
    for (let k = 0; k < 12; k++) {
      const angle = (k / 12) * Math.PI * 2;

      ctx.fillRect(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius, 8, 8);
    }
  }
  ctx.globalAlpha = 1;
}

const SCENES: ((ctx: Ctx, t: number) => void)[] = [
  // 1. The Andes at sunrise: Cuyo walks in wearing his chullo; his granny waves.
  (ctx, t) => {
    backdrop(ctx, SKY);
    ctx.fillStyle = css(MAIZE);
    ctx.fillRect(90, 300 - ease(t / 4) * 220, 70, 70);
    mountains(ctx);
    stand(ctx, BARE_CUY, GRANNY_COLORS, 8, 780, GROUND - (t > 6 ? hop(t, 0.6, 6) : 0), true);
    const x = -150 + ease(t / 5) * 590;
    cuy(ctx, x, GROUND - (t > 5 ? hop(t - 5, 0.45, 26) : hop(t, 0.25, 6)));
    sayDuring(ctx, t, 5.5, 9.5, '¡Cuídalo mucho, Cuyo!', 780, GROUND - 120);
    if (t > 7) heart(ctx, x + 60, GROUND - 150 - (t - 7) * 20);
  },
  // 2. A gust of wind lifts the chullo off his head and away.
  (ctx, t) => {
    backdrop(ctx, SKY);
    mountains(ctx);
    wind(ctx, t, clamp((t - 1.5) / 1.5));
    const x = 380 + (t > 4 ? ease((t - 4) / 5) * 300 : 0);
    const shiver = t > 1.5 && t < 3 ? Math.sin(t * 50) * 3 : 0;
    if (t < 3) {
      cuy(ctx, x + shiver, GROUND);
    } else {
      bareCuy(ctx, x, GROUND - (t > 4 ? hop(t, 0.25, 18) : 0));
      const flight = t - 3;
      chullo(ctx, 380 + flight * 130 + Math.sin(t * 5) * 40, GROUND - 112 - flight * flight * 14);
    }
    sayDuring(ctx, t, 3.3, 9, '¡Mi chullo!', x + 40, GROUND - 120);
  },
  // 3. The chullo falls into the llama's suitcase; Cuyo jumps in after it, and off they go.
  (ctx, t) => {
    backdrop(ctx, SKY);
    mountains(ctx);
    const leave = t > 8 ? ease((t - 8) / 2) * 800 : 0;
    stand(ctx, LLAMA, LLAMA_CSS, 8, 220 + leave, GROUND);
    const shake = t > 6.5 && t < 8 ? Math.sin(t * 40) * 4 : 0;
    stand(ctx, SUITCASE, SUITCASE_COLORS, 10, 620 + shake + leave, GROUND);
    if (t < 2.5) chullo(ctx, 580 + Math.sin(t * 4) * 50, -60 + ease(t / 2.5) * 410);
    if (t < 6) {
      const jump = clamp((t - 4) / 2);
      const x = 900 - ease((t - 1) / 3) * 180 - jump * 100;
      bareCuy(ctx, x, GROUND - Math.sin(jump * Math.PI) * 170 - jump * 40, 7, true);
    }
    sayDuring(ctx, t, 6.5, 8.5, '¿Eh? ¡Ya nos vamos!', 260, GROUND - 170);
  },
  // 4. The suitcase flies over the ocean, with Cuyo peeking out in his chullo.
  (ctx, t) => {
    ctx.fillStyle = SKY;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = SEA;
    ctx.fillRect(0, 380, W, H - 380);
    clouds(ctx, t, 120);
    const x = -150 + (t / SCENE_SECONDS) * (W + 300);
    const y = 220 + Math.sin(t * 2.4) * 30;
    for (let dot = 1; dot < 12; dot++) {
      ctx.fillStyle = css(MAIZE);
      ctx.fillRect(x - 70 - dot * 34, y + 60 + Math.sin((t - dot * 0.28) * 2.4) * 30 - Math.sin(t * 2.4) * 30, 8, 8);
    }
    const flap = Math.sin(t * 18) > 0;
    draw(ctx, flap ? WING : [...WING].reverse(), { W: '#ffffff' }, 8, x - 90, y + (flap ? 0 : 20));
    stand(ctx, SUITCASE, SUITCASE_COLORS, 10, x, y + 90);
    // Cuyo's head and chullo over the lid.
    draw(ctx, CUY.slice(0, 9).map((row) => row.slice(12)), CUY_COLORS, 6, x - 40, y - 30 + hop(t, 0.6, 4));
  },
  // 5. Prague: Cuyo eats a potato pancake in front of the Týn Church.
  (ctx, t) => {
    backdrop(ctx, '#d6f1f7');
    landmark(ctx, 'czechia');
    const potato = COUNTRY_THINGS.czechia[3];
    const left = clamp(1 - (t - 4) / 4);
    if (left > 0) {
      const visible = potato.map((row) => row.slice(0, Math.ceil(row.length * left)));
      stand(ctx, visible, ART, 9, 460, GROUND);
    }
    const x = -120 + ease(t / 3.5) * 450;
    cuy(ctx, x, GROUND - (t > 4 && t < 8 ? hop(t, 0.18, 6) : 0));
    sayDuring(ctx, t, 8, 10, '¡Qué rico!', x + 40, GROUND - 120);
  },
  // 6. Prague: a pigeon swoops down and steals the chullo.
  (ctx, t) => {
    backdrop(ctx, '#d6f1f7');
    landmark(ctx, 'czechia');
    const x = 330;
    const grab = 3.5;
    const hatX = x;
    const hatY = GROUND - 112;
    if (t < grab) {
      const dive = ease(t / grab);
      cuy(ctx, x, GROUND);
      pigeon(ctx, lerp(-80, hatX + 36, dive), lerp(40, hatY - 14, dive), t);
    } else {
      const away = (t - grab) / 4;
      const px = lerp(hatX + 36, W + 160, away);
      const py = lerp(hatY - 14, -40, away) + Math.sin(t * 4) * 12;
      bareCuy(ctx, x, GROUND - (t > 4.5 ? hop(t, 0.3, 16) : 0));
      chullo(ctx, px - 40, py + 18);
      pigeon(ctx, px, py, t);
    }
    sayDuring(ctx, t, 4.3, 9.5, '¡Oye! ¡Devuélveme mi chullo!', x + 30, GROUND - 120);
  },
  // 7. Berlin: Cuyo races a car on the motorway, chasing the pigeon.
  (ctx, t) => {
    backdrop(ctx, '#d6f1f7', '#4a4a52');
    landmark(ctx, 'germany');
    ctx.fillStyle = '#4a4a52';
    ctx.fillRect(0, GROUND - 4, W, H - GROUND + 4);
    ctx.fillStyle = css(ALPACA);
    for (let x = -((t * 400) % 120); x < W; x += 120) ctx.fillRect(x, GROUND + 50, 60, 8);
    stand(ctx, COUNTRY_THINGS.germany[1], ART, 8, -150 + t * 95, GROUND + 30);
    const cuyX = -150 + t * 130 + (t > 5 ? (t - 5) ** 2 * 18 : 0);
    for (let line = 0; line < 4; line++) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cuyX - 160 - line * 10, GROUND - 30 - line * 22, 70, 5);
    }
    bareCuy(ctx, cuyX, GROUND + 26 - hop(t, 0.12, 8), 7);
    const birdX = cuyX + 230;
    const birdY = 130 + Math.sin(t * 3) * 20;
    chullo(ctx, birdX - 40, birdY + 18);
    pigeon(ctx, birdX, birdY, t);
    sayDuring(ctx, t, 1.5, 4.5, '¡Más rápido que un auto!', cuyX + 40, GROUND - 90);
  },
  // 8. Berlin: the pigeon drops the chullo into a parcel for Tokyo; Cuyo jumps in.
  (ctx, t) => {
    backdrop(ctx, '#d6f1f7');
    landmark(ctx, 'germany');
    const boxX = 360;
    const shake = t > 7 ? Math.sin(t * 40) * 4 : 0;
    parcel(ctx, boxX + shake, GROUND, t < 7);
    const birdX = lerp(-80, W + 100, t / 5);
    if (t < 5) pigeon(ctx, birdX, 120 + Math.sin(t * 4) * 10, t);
    if (t < 1.9) chullo(ctx, birdX - 40, 138);
    else if (t < 3) chullo(ctx, boxX - 36, lerp(138, GROUND - 120, (t - 1.9) / 1.1));
    sayDuring(ctx, t, 0.5, 2.5, '¡Cucurrú!', birdX, 100);
    if (t > 3.2 && t < 6.5) {
      const jump = clamp((t - 5.5) / 1);
      const x = lerp(-120, boxX - 90, ease((t - 3.2) / 2.3)) + jump * 90;
      bareCuy(ctx, x, GROUND - Math.sin(jump * Math.PI) * 160 - jump * 40, 6);
    }
    sayDuring(ctx, t, 7.5, 10, '¡Tokio, allá voy!', boxX, GROUND - 140);
  },
  // 9. A night flight in a cargo plane, Cuyo at the window.
  (ctx, t) => {
    ctx.fillStyle = NIGHT;
    ctx.fillRect(0, 0, W, H);
    stars(ctx, t);
    ctx.fillStyle = '#fff4c2';
    ctx.fillRect(780, 60, 70, 70);
    ctx.fillStyle = NIGHT;
    ctx.fillRect(800, 50, 60, 60);
    clouds(ctx, t, 60, '#3b4a7a');
    plane(ctx, lerp(-260, W + 260, t / SCENE_SECONDS), 300 + Math.sin(t * 1.5) * 16, t);
  },
  // 10. Tokyo: the parcel lands, the ground shakes, the chullo blows away again.
  (ctx, t) => {
    const shaking = t > 2 && t < 6.5;
    ctx.fillStyle = '#ffd9e6';
    ctx.fillRect(0, 0, W, H);
    ctx.save();
    if (shaking) ctx.translate(Math.sin(t * 47) * 10, Math.cos(t * 39) * 6);
    backdrop(ctx, '#ffd9e6');
    landmark(ctx, 'japan');
    const boxX = 360;
    parcel(ctx, boxX, Math.min(GROUND, -60 + t * 400), t > 5);
    if (t > 5) {
      const pop = clamp((t - 5) / 0.6);
      bareCuy(ctx, boxX - 130, GROUND - Math.sin(pop * Math.PI) * 120, 7, true);
    }
    if (t > 6.5) {
      const flight = t - 6.5;
      chullo(ctx, boxX + flight * 150 + Math.sin(t * 5) * 30, GROUND - 160 - flight * flight * 22);
    }
    ctx.restore();
    if (shaking && Math.sin(t * 10) > -0.3) {
      ctx.fillStyle = css(COCHINEAL);
      ctx.font = `900 76px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.fillText('¡TEMBLOR!', W / 2, 120);
      ctx.textAlign = 'start';
    }
    sayDuring(ctx, t, 7, 10, '¡Nooo, otra vez!', boxX - 130, GROUND - 110);
  },
  // 11. Tokyo: sushi, then a sigh for ceviche.
  (ctx, t) => {
    backdrop(ctx, '#ffd9e6');
    landmark(ctx, 'japan');
    if (t < 4.5) stand(ctx, SUSHI, SUSHI_COLORS, 9, 470, GROUND - hop(t, 0.5, 4));
    const x = -120 + ease(t / 3) * 400;
    bareCuy(ctx, x, GROUND - (t > 3 && t < 4.5 ? hop(t, 0.15, 6) : 0));
    sayDuring(ctx, t, 3.2, 4.6, '¡Oishii!', x + 40, GROUND - 110);
    if (t > 4.8) {
      // A thought bubble with a bowl of ceviche: fish, onion and lime.
      const bob = Math.sin(t * 3) * 5;
      ctx.fillStyle = '#ffffff';
      [[x + 60, GROUND - 150, 10], [x + 85, GROUND - 185, 16]].forEach(([cx, cy, size]) => ctx.fillRect(cx, cy + bob, size, size));
      ctx.fillRect(x + 100, GROUND - 330 + bob, 220, 130);
      draw(ctx, COUNTRY_THINGS.japan[2], ART, 10, x + 140, GROUND - 305 + bob);
    }
  },
  // 12. Cuyo climbs Mount Fuji to the chullo at the top.
  (ctx, t) => {
    backdrop(ctx, '#bfe3f2');
    clouds(ctx, t, 30);
    fuji(ctx);
    const got = t > 8.8;
    if (!got) chullo(ctx, FUJI_X - 27 + Math.sin(t * 3) * 6, FUJI_TOP - 36, 6);
    const row = lerp(FUJI_ROWS + 2, 1, ease((t - 0.5) / 8.3));
    const x = FUJI_X + fujiHalf(row) - 30;
    const y = FUJI_TOP + row * FUJI_STEP - hop(t, 0.3, 8);
    if (got) {
      cuy(ctx, x, y, 6, true);
      heart(ctx, x, y - 110 - (t - 8.8) * 30);
    } else {
      bareCuy(ctx, x, y, 6, true);
    }
    sayDuring(ctx, t, 1, 4, '¡Allá está!', Math.min(x, W - 120), y - 90);
  },
  // 13. On the summit at sunset; the llama flies in to take Cuyo home.
  (ctx, t) => {
    backdrop(ctx, SUNSET, '#ffffff');
    ctx.fillStyle = '#fff0b0';
    ctx.fillRect(820, 260, 90, 90);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, GROUND, W, H - GROUND);
    // Fuji's snowy summit under Cuyo.
    for (let row = 0; row < 12; row++) {
      ctx.fillStyle = row < 7 ? '#ffffff' : '#4f6a9a';
      ctx.fillRect(SUMMIT_X - 110 - row * 30, SUMMIT_Y + row * 10, 220 + row * 60, 10);
    }
    const llamaX = lerp(-220, 280, ease((t - 3) / 3.5));
    const llamaY = 300 + Math.sin(t * 2.5) * 14;
    const jump = clamp((t - 8.3) / 1.2);
    if (jump < 1) {
      cuy(ctx, lerp(SUMMIT_X, llamaX - 24, jump), lerp(SUMMIT_Y, llamaY - 54, jump) - Math.sin(jump * Math.PI) * 120 - (t < 3 ? hop(t, 0.4, 20) : 0), 8, jump > 0);
    }
    if (t > 3) flyingLlama(ctx, llamaX, llamaY, t, jump >= 1);
    sayDuring(ctx, t, 0.3, 3, '¡Lo encontré!', SUMMIT_X + 20, SUMMIT_Y - 120);
    sayDuring(ctx, t, 6, 8.3, '¡Sube, causa! Volvemos a casa.', llamaX + 60, llamaY - 130);
  },
  // 14. The llama and Cuyo fly home over the ocean.
  (ctx, t) => {
    ctx.fillStyle = SUNSET;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = SEA;
    ctx.fillRect(0, 400, W, H - 400);
    clouds(ctx, t, 140, '#ffe2c4');
    const x = lerp(120, 760, ease(t / 10));
    const y = 280 + Math.sin(t * 2.2) * 30;
    flyingLlama(ctx, x, y, t, true);
    sayDuring(ctx, t, 3, 6.5, '¡Gracias, llama!', x - 20, y - 110);
  },
  // 15. The party at home with granny and ceviche, then the end.
  (ctx, t) => {
    if (t > 6.5) {
      ctx.fillStyle = NIGHT;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = css(MAIZE);
      ctx.textAlign = 'center';
      ctx.font = `900 110px ${FONT}`;
      ctx.fillText('¡FIN!', W / 2, 190);
      ctx.fillStyle = css(ALPACA);
      ctx.font = `800 34px ${FONT}`;
      ctx.fillText('¡Habla, causa! Ahora juega tú.', W / 2, 260);
      ctx.font = `700 26px ${FONT}`;
      ctx.fillText('Y tú, ¿a qué país viajarías?', W / 2, 305);
      ctx.textAlign = 'start';
      cuy(ctx, W / 2, 470 - hop(t, 0.4, 20));
      return;
    }
    backdrop(ctx, NIGHT);
    stars(ctx, t);
    fireworks(ctx, t);
    stand(ctx, MACHU_PICCHU, RUINS_CSS, 11, 790, GROUND);
    stand(ctx, BARE_CUY, GRANNY_COLORS, 8, 170, GROUND - hop(t, 0.5, 8));
    stand(ctx, COUNTRY_THINGS.japan[2], ART, 9, 340, GROUND);
    cuy(ctx, 510, GROUND - hop(t, 0.35, 30), 8, true);
    sayDuring(ctx, t, 0.3, 3.2, '¡Bienvenido, Cuyo!', 170, GROUND - 120);
    sayDuring(ctx, t, 3.4, 6.5, '¡Abuela, fui hasta Japón!', 520, GROUND - 150);
  },
];

const STORY_SECONDS = SCENES.length * SCENE_SECONDS;

let open: (() => void) | null = null;

/** Plays the story in a full-window overlay. A click on the close button, or Esc, ends it early. */
export function playCuyStory(): void {
  if (open) return;

  const overlay = document.createElement('div');
  const canvas = document.createElement('canvas');
  const caption = document.createElement('p');
  const bar = document.createElement('div');
  const close = document.createElement('button');
  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  overlay.className = 'cuy-story';
  canvas.width = W;
  canvas.height = H;
  caption.className = 'cuy-caption';
  bar.className = 'cuy-progress';
  close.className = 'cuy-close';
  close.type = 'button';
  close.textContent = '✕ Cerrar';
  overlay.append(close, canvas, caption, bar);
  document.body.append(overlay);

  const start = performance.now();
  let frame = 0;
  let shown = -1;

  const end = () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('keydown', onKey);
    overlay.remove();
    open = null;
  };
  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') end();
  };
  const tick = (now: number) => {
    // A frame's timestamp can be a little earlier than the moment the story started.
    const seconds = Math.max(0, (now - start) / 1000);

    if (seconds >= STORY_SECONDS) {
      end();
      return;
    }

    const scene = Math.min(SCENES.length - 1, Math.floor(seconds / SCENE_SECONDS));

    ctx.imageSmoothingEnabled = false;
    SCENES[scene](ctx, seconds - scene * SCENE_SECONDS);

    if (scene !== shown) {
      shown = scene;
      caption.textContent = CAPTIONS[scene];
    }

    bar.style.transform = `scaleX(${seconds / STORY_SECONDS})`;
    frame = requestAnimationFrame(tick);
  };

  close.addEventListener('click', end);
  window.addEventListener('keydown', onKey);
  open = end;
  frame = requestAnimationFrame(tick);
}
