import { GAME_QR } from './gameQr';
import { ALPACA, INDIGO, MADDER, MAIZE } from './theme';

/**
 * Extras for the empty red margins beside the game on a computer: the game's QR code on the left
 * and a cuy in a chullo on the right. They are page elements, not part of the canvas, and show
 * only on the home page, with a mouse, and when the margins are wide enough (see style.css).
 */

const hex = (color: number) => `#${color.toString(16).padStart(6, '0')}`;

/** Pixel art as SVG rectangles, one per run of the same colour in a row. */
function pixels(rows: readonly string[], colors: Record<string, string>, cell: number, x0 = 0, y0 = 0): string {
  let svg = '';

  rows.forEach((row, r) => {
    for (let c = 0; c < row.length; ) {
      let end = c;

      while (end < row.length && row[end] === row[c]) end++;

      const fill = colors[row[c]];

      if (fill) {
        svg += `<rect x="${x0 + c * cell}" y="${y0 + r * cell}" width="${(end - c) * cell}" height="${cell}" fill="${fill}"/>`;
      }

      c = end;
    }
  });

  return svg;
}

/** A guinea pig in a chullo, the Andean knitted hat, facing right. */
const CUY = [
  '.................Y........',
  '................RRR.......',
  '...............RYYYR......',
  '..............RIIIIIR.....',
  '..............RYRYRYR.....',
  '.............RRRRRRRRR....',
  '......BBBBBBBRBBWWWWBR....',
  '....BBBBBBBBBRBWWWWWWR....',
  '...BBBWWWBBBBRWWWEWWWWW...',
  '..BBBWWWWWBBBYWWWWWWWWWP..',
  '..BBBBWWWBBBBYBWWWWWWWW...',
  '..BBBBBBBBBBBBBBWWWWWW....',
  '...BBBBBBBBBBBBBBBBBB.....',
  '....PP..PP.....PP..PP.....',
];
const CUY_COLORS = {
  B: '#9c6b3f',
  W: hex(ALPACA),
  E: '#23201f',
  P: '#f6a8c4',
  R: '#e2452f',
  Y: hex(MAIZE),
  I: hex(INDIGO),
};

function qrCard(): string {
  const cell = 5;
  const quiet = 3;
  const size = (GAME_QR.length + 2 * quiet) * cell;
  const svg =
    `<svg viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges" aria-hidden="true">` +
    `<rect width="${size}" height="${size}" fill="#ffffff"/>` +
    pixels(GAME_QR, { X: hex(INDIGO) }, cell, quiet * cell, quiet * cell) +
    '</svg>';

  return `
    <div class="side-card qr-card">
      ${svg}
      <p class="side-title">¡Juega en tu celular!</p>
      <p class="side-note">Escanea el código con la cámara</p>
    </div>`;
}

function cuyCard(): string {
  const cell = 8;
  const width = CUY[0].length * cell;
  const height = CUY.length * cell;
  const svg = `<svg class="cuy" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges" aria-hidden="true">${pixels(CUY, CUY_COLORS, cell)}</svg>`;

  return `
    <div class="cuy-scene">
      <p class="bubble">¡Habla, causa!<br>¿Ya jugaste?</p>
      ${svg}
      <p class="side-note">Cuy con chullo. 100 % peruano.</p>
    </div>`;
}

let panels: HTMLElement[] = [];

/** Adds the two side panels to the page once. */
export function createSidePanels(): void {
  const left = document.createElement('aside');
  const right = document.createElement('aside');

  left.className = 'side side-left';
  right.className = 'side side-right';
  left.innerHTML = qrCard();
  right.innerHTML = cuyCard();
  document.documentElement.style.setProperty('--madder', hex(MADDER));
  document.body.append(left, right);
  panels = [left, right];
}

/** Sizes the panels to the margins beside the game; they hide when the margins are too narrow. */
export function fitSidePanels(windowWidth: number, gameWidth: number): void {
  const margin = (windowWidth - gameWidth) / 2;

  document.documentElement.style.setProperty('--side-width', `${margin}px`);
  document.body.classList.toggle('wide-margins', margin >= 240);
}

/** Shows the panels on the home page only. */
export function showSidePanels(visible: boolean): void {
  if (panels.length > 0) {
    document.body.classList.toggle('on-home', visible);
  }
}
