import { GAME_QR } from './gameQr';
import { CUY, CUY_COLORS, css as hex } from './cuyArt';
import { playCuyStory } from './cuyStory';
import { INDIGO, MADDER } from './theme';

/**
 * Extras for the empty red margins beside the game on a computer: the game's QR code on the left
 * and a cuy in a chullo on the right. They are page elements, not part of the canvas, and show
 * only on the home page, with a mouse, and when the margins are wide enough (see style.css).
 */

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


/** The game's QR code as an SVG with a white quiet zone around it. */
function qrSvg(): string {
  const cell = 5;
  const quiet = 3;
  const size = (GAME_QR.length + 2 * quiet) * cell;

  return (
    `<svg viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges" aria-hidden="true">` +
    `<rect width="${size}" height="${size}" fill="#ffffff"/>` +
    pixels(GAME_QR, { X: hex(INDIGO) }, cell, quiet * cell, quiet * cell) +
    '</svg>'
  );
}

function qrCard(): string {
  return `
    <div class="side-card qr-card" title="Doble clic para verlo grande">
      ${qrSvg()}
      <p class="side-title">¡Juega en tu celular!</p>
      <p class="side-note">Escanea el código con la cámara</p>
      <p class="side-hint">Doble clic para verlo grande</p>
    </div>`;
}

/** Shows the QR code large in the middle of the window, for scanning from across the room. */
function showBigQr(): void {
  if (document.querySelector('.qr-big')) return;

  const overlay = document.createElement('div');

  overlay.className = 'qr-big';
  overlay.innerHTML = `
    <div class="qr-big-card">
      ${qrSvg()}
      <p class="qr-big-title">¡Juega en tu celular!</p>
      <p class="side-note">Haz clic en cualquier lugar o pulsa Esc para cerrar</p>
    </div>`;

  const close = () => {
    overlay.remove();
    window.removeEventListener('keydown', onKey);
  };
  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') close();
  };

  overlay.addEventListener('click', close);
  window.addEventListener('keydown', onKey);
  document.body.append(overlay);
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
  listenForPokes(right.querySelector('.cuy'));
  left.querySelector('.qr-card')?.addEventListener('dblclick', showBigQr);
}

const POKES_TO_PLAY = 5;
const POKE_GAP_MS = 1500;

/** The easter egg: five quick clicks on the cuy play its story. Each click makes it jump. */
function listenForPokes(cuy: Element | null): void {
  let pokes = 0;
  let last = 0;

  // Back to its usual hopping once the jump is over.
  cuy?.addEventListener('animationend', () => cuy.classList.remove('poked'));
  cuy?.addEventListener('click', () => {
    const now = performance.now();

    pokes = now - last > POKE_GAP_MS ? 1 : pokes + 1;
    last = now;
    cuy.classList.remove('poked');
    // Restart the jump animation on every click.
    void (cuy as SVGElement).getBoundingClientRect();
    cuy.classList.add('poked');

    if (pokes >= POKES_TO_PLAY) {
      pokes = 0;
      playCuyStory();
    }
  });
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
