import { COUNTRY_LANDMARKS, COUNTRY_THINGS, ART_COLORS } from './countryArt';
import { CUY, CUY_COLORS, css } from './cuyArt';
import { LLAMA, LLAMA_COLORS } from './logo';
import { ALPACA, CHILCA, COCHINEAL, INDIGO, MADDER, MAIZE } from './theme';

/**
 * The cuy's secret story: clicking the cuy beside the home page five times plays a one-minute
 * animation of how it hid in the llama's suitcase and saw Prague, Berlin and Tokyo.
 * Six scenes of ten seconds, drawn on a canvas in the game's pixel style, with a caption under each.
 */

const W = 960;
const H = 540;
const GROUND = 430;
const SCENE_SECONDS = 10;
const STORY_SECONDS = 60;

const CAPTIONS = [
  'En lo alto de los Andes vive Cuyo, un cuy muy curioso.',
  'Un día ve a la llama preparar su maleta para viajar por el mundo… ¡y se mete adentro!',
  '¡A volar! Cuyo cruza el océano de polizón.',
  'En Praga descubre el bramborák. ¡Papa, como en el Perú!',
  'En Berlín corre por la autopista… ¡más rápido que los autos!',
  'En Tokio prueba el sushi… pero extraña su ceviche. ¡Fin!',
];

type Colors = Record<string, string>;

const toCss = (colors: Record<string, number>): Colors =>
  Object.fromEntries(Object.entries(colors).map(([key, value]) => [key, css(value)]));

const ART = toCss(ART_COLORS);
const LLAMA_CSS = toCss(LLAMA_COLORS);
const SKY = '#9fd6ea';
const NIGHT = css(INDIGO);
const GRASS = '#57b35f';

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

function draw(ctx: CanvasRenderingContext2D, rows: readonly string[], colors: Colors, cell: number, x: number, y: number, flip = false): void {
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
function stand(ctx: CanvasRenderingContext2D, rows: readonly string[], colors: Colors, cell: number, x: number, y: number, flip = false): void {
  draw(ctx, rows, colors, cell, x - (rows[0].length * cell) / 2, y - rows.length * cell, flip);
}

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => 0.5 - Math.cos(clamp(value) * Math.PI) / 2;
const hop = (time: number, every = 0.5, height = 14) => Math.abs(Math.sin((time / every) * Math.PI)) * height;

function backdrop(ctx: CanvasRenderingContext2D, sky: string, ground = GRASS): void {
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = ground;
  ctx.fillRect(0, GROUND, W, H - GROUND);
  ctx.fillStyle = css(MAIZE);
  ctx.fillRect(0, GROUND, W, 8);
}

/** Stepped pixel mountains with snowy tops. */
function mountains(ctx: CanvasRenderingContext2D): void {
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
}

function clouds(ctx: CanvasRenderingContext2D, time: number, speed: number): void {
  [80, 170, 60].forEach((y, index) => {
    const x = ((index * 380 - time * speed) % (W + 200) + W + 200) % (W + 200) - 100;

    draw(ctx, CLOUD, { W: '#ffffff' }, 8, x, y);
  });
}

function landmark(ctx: CanvasRenderingContext2D, country: 'czechia' | 'germany' | 'japan'): void {
  const { rows } = COUNTRY_LANDMARKS[country];

  stand(ctx, rows, ART, 10, 700, GROUND);
}

const SCENES: ((ctx: CanvasRenderingContext2D, t: number) => void)[] = [
  // 1. The Andes at sunrise: Cuyo walks in and hops.
  (ctx, t) => {
    backdrop(ctx, SKY);
    ctx.fillStyle = css(MAIZE);
    ctx.fillRect(820, 300 - ease(t / 4) * 220, 70, 70);
    mountains(ctx);
    ctx.fillStyle = GRASS;
    ctx.fillRect(0, GROUND, W, H - GROUND);
    const x = -150 + ease(t / 5) * 610;
    stand(ctx, CUY, CUY_COLORS, 8, x, GROUND - (t > 5 ? hop(t - 5, 0.45, 26) : hop(t, 0.25, 6)));
    if (t > 7) stand(ctx, HEART, { R: css(COCHINEAL) }, 6, x + 60, GROUND - 150 - (t - 7) * 20);
  },
  // 2. The llama's suitcase; Cuyo jumps in.
  (ctx, t) => {
    backdrop(ctx, SKY);
    mountains(ctx);
    ctx.fillStyle = GRASS;
    ctx.fillRect(0, GROUND, W, H - GROUND);
    stand(ctx, LLAMA, LLAMA_CSS, 8, 220, GROUND);
    const shake = t > 6.5 ? Math.sin(t * 40) * 4 : 0;
    stand(ctx, SUITCASE, SUITCASE_COLORS, 10, 620 + shake, GROUND);
    if (t < 6) {
      const jump = clamp((t - 4) / 2);
      const x = 900 - ease(t / 4) * 180 - jump * 100;
      stand(ctx, CUY, CUY_COLORS, 7, x, GROUND - Math.sin(jump * Math.PI) * 170 - jump * 40, true);
    }
    if (t > 6.5) {
      ctx.fillStyle = css(INDIGO);
      ctx.font = '900 64px "Segoe UI", system-ui, sans-serif';
      ctx.fillText('!', 610, GROUND - 120 - hop(t, 0.3, 10));
    }
  },
  // 3. The suitcase flies over the ocean, with Cuyo peeking out.
  (ctx, t) => {
    ctx.fillStyle = SKY;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#2f7fc1';
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
  // 4. Prague: Cuyo eats a potato in front of the Týn Church.
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
    stand(ctx, CUY, CUY_COLORS, 8, x, GROUND - (t > 4 && t < 8 ? hop(t, 0.18, 6) : 0));
    if (t > 8) stand(ctx, HEART, { R: css(COCHINEAL) }, 6, x, GROUND - 140 - (t - 8) * 30);
  },
  // 5. Berlin: Cuyo races a car on the motorway and wins.
  (ctx, t) => {
    backdrop(ctx, '#d6f1f7', '#4a4a52');
    landmark(ctx, 'germany');
    ctx.fillStyle = '#4a4a52';
    ctx.fillRect(0, GROUND - 4, W, H - GROUND + 4);
    ctx.fillStyle = css(ALPACA);
    for (let x = -((t * 400) % 120); x < W; x += 120) ctx.fillRect(x, GROUND + 50, 60, 8);
    const car = COUNTRY_THINGS.germany[1];
    stand(ctx, car, ART, 8, -150 + t * 95, GROUND + 30);
    const cuyX = -150 + t * 130 + (t > 5 ? (t - 5) ** 2 * 18 : 0);
    for (let line = 0; line < 4; line++) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cuyX - 160 - line * 10, GROUND - 30 - line * 22, 70, 5);
    }
    stand(ctx, CUY, CUY_COLORS, 7, cuyX, GROUND + 26 - hop(t, 0.12, 8));
  },
  // 6. Tokyo: sushi, a sigh for ceviche, then the end.
  (ctx, t) => {
    if (t > 7) {
      ctx.fillStyle = NIGHT;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = css(MAIZE);
      ctx.textAlign = 'center';
      ctx.font = '900 110px "Segoe UI", system-ui, sans-serif';
      ctx.fillText('¡FIN!', W / 2, 220);
      ctx.fillStyle = css(ALPACA);
      ctx.font = '800 34px "Segoe UI", system-ui, sans-serif';
      ctx.fillText('¡Habla, causa! Ahora juega tú.', W / 2, 290);
      ctx.textAlign = 'start';
      stand(ctx, CUY, CUY_COLORS, 8, W / 2, 460 - hop(t, 0.4, 20));
      return;
    }
    backdrop(ctx, '#ffd9e6');
    landmark(ctx, 'japan');
    if (t < 4.5) stand(ctx, SUSHI, SUSHI_COLORS, 9, 470, GROUND - hop(t, 0.5, 4));
    const x = -120 + ease(t / 3) * 400;
    stand(ctx, CUY, CUY_COLORS, 8, x, GROUND - (t > 3 && t < 4.5 ? hop(t, 0.15, 6) : 0));
    if (t > 4.5) {
      // A thought bubble with a bowl of ceviche: fish, onion and lime.
      const bob = Math.sin(t * 3) * 5;
      ctx.fillStyle = '#ffffff';
      [[x + 60, GROUND - 150, 10], [x + 85, GROUND - 185, 16]].forEach(([cx, cy, size]) => ctx.fillRect(cx, cy + bob, size, size));
      ctx.fillRect(x + 100, GROUND - 330 + bob, 220, 130);
      draw(ctx, COUNTRY_THINGS.japan[2], ART, 10, x + 140, GROUND - 305 + bob);
    }
  },
];

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
