import { Container, Graphics, Ticker, type DestroyOptions } from 'pixi.js';
import { clamp01, easeInOut, reducedMotion } from './motion';
import { ALPACA, MAIZE } from './theme';
import { weave } from './woven';

const GLASS = 0xd6f1f7;
const CELL = 8;
const MUG = [
  'G............G..',
  'G............G..',
  'G............GGG',
  'G............G.G',
  'G............G.G',
  'G............G.G',
  'G............G.G',
  'G............GGG',
  'G............G..',
  'G............G..',
  'G............G..',
  'GGGGGGGGGGGGGG..',
];
const INNER_LEFT = CELL;
const INNER_WIDTH = 12 * CELL;
const INNER_BOTTOM = 11 * CELL;

const FILL_DELAY_MS = 500;
const FILL_MS = 1800;
const FOAM_START = 0.6;
const FOAM_HEIGHT = 3 * CELL;
/** Where the poured beer falls, measured from the mug's left edge. */
export const STREAM_X = INNER_LEFT + 5 * CELL;
export const STREAM_WIDTH = 2 * CELL;
const BUBBLES = [
  { column: 2, speed: 0.05, phase: 0 },
  { column: 4, speed: 0.08, phase: 30 },
  { column: 6, speed: 0.06, phase: 60 },
  { column: 8, speed: 0.09, phase: 15 },
  { column: 10, speed: 0.07, phase: 45 },
];
const BUBBLE_SIZE = 4;
const FOAM_WAVE_MS = 450;
const DRIP_START_MS = 600;
const DRIP_MS = 5000;
const DRIP_LENGTH = 4 * CELL;

/**
 * A mug that fills with beer and foam, then keeps bubbling. `streamTop` is how high the poured beer
 * starts, from the top of the glass. A `full` mug skips the pouring, and phones set to reduce motion show it full and still.
 */
export class BeerMug extends Container {
  static readonly WIDTH = MUG[0].length * CELL;

  private readonly beer = new Graphics();
  private elapsed = -FILL_DELAY_MS;

  private readonly streamTop: number;

  constructor(streamTop: number, full: boolean) {
    super();
    this.streamTop = streamTop;
    this.addChild(this.beer, weave(new Graphics(), MUG, { G: GLASS }, 0, 0, CELL));

    if (full || reducedMotion()) {
      this.elapsed = FILL_MS;
    }

    this.draw();

    if (!reducedMotion()) {
      Ticker.shared.add(this.update, this);
    }
  }

  override destroy(options?: DestroyOptions): void {
    Ticker.shared.remove(this.update, this);
    super.destroy(options);
  }

  private update(ticker: Ticker): void {
    this.elapsed += ticker.deltaMS;
    this.draw();
  }

  private draw(): void {
    const fill = clamp01(this.elapsed / FILL_MS);
    const settled = this.elapsed - FILL_MS;
    const level = Math.round((easeInOut(fill) * INNER_BOTTOM) / CELL) * CELL;
    const surface = INNER_BOTTOM - level;
    const graphics = this.beer.clear();

    if (this.elapsed > 0 && fill < 1) {
      graphics.rect(STREAM_X, this.streamTop, STREAM_WIDTH, surface - this.streamTop).fill(MAIZE);
    }

    if (level === 0) {
      return;
    }

    graphics.rect(INNER_LEFT, surface, INNER_WIDTH, level).fill(MAIZE);

    for (const { column, speed, phase } of BUBBLES) {
      const risen = (Math.max(0, this.elapsed) * speed + phase) % level;

      graphics.rect(INNER_LEFT + column * CELL, INNER_BOTTOM - risen - BUBBLE_SIZE, BUBBLE_SIZE, BUBBLE_SIZE).fill(ALPACA);
    }

    const foam = (FOAM_HEIGHT * clamp01((fill - FOAM_START) / (1 - FOAM_START))) | 0;

    if (foam === 0) {
      return;
    }

    graphics.rect(INNER_LEFT, surface - foam + CELL, INNER_WIDTH, foam).fill(ALPACA);

    if (fill < 1) {
      return;
    }

    // Foam settling: bumps along the top, and one slow drip down the outside of the glass.
    const wave = Math.floor(settled / FOAM_WAVE_MS);

    for (let column = 0; column < 12; column += 2) {
      if ((column / 2 + wave) % 2 === 0) {
        graphics.rect(INNER_LEFT + column * CELL, surface - foam, 2 * CELL, CELL).fill(ALPACA);
      }
    }

    const drip = Math.round((DRIP_LENGTH * clamp01((settled - DRIP_START_MS) / DRIP_MS)) / CELL) * CELL;

    if (drip > 0) {
      graphics.rect(0, 0, CELL, drip).fill(ALPACA);
    }
  }
}
