import { Graphics } from 'pixi.js';
import { DESIGN_HEIGHT, DESIGN_WIDTH, type Fit } from './layout';
import { Screen } from './screens';
import { ALPACA, INDIGO, MAIZE } from './theme';
import { weave } from './woven';

const BAND_CELL = 8;
const BAND_PATTERN = ['YYYYYYYY', 'IIIWIIII', 'IIWWWIII', 'IIIWIIII', 'YYYYYYYY'];
const BAND_COLORS = { Y: MAIZE, I: INDIGO, W: ALPACA };

/** Height of the woven border at the top and bottom of every screen. */
export const BAND_HEIGHT = BAND_PATTERN.length * BAND_CELL;

/**
 * A screen edged with a woven border. The borders stick to the top and bottom of the
 * window and run its full width, so they also cover the empty bars on any phone shape.
 */
export class WovenScreen extends Screen {
  private readonly topBand = new Graphics();
  private readonly bottomBand = new Graphics();

  constructor() {
    super();
    this.addChild(this.topBand, this.bottomBand);
  }

  /** The borders stay put and only what is between them fades, so they do not flicker between screens. */
  override setFade(alpha: number): void {
    for (const child of this.children) {
      if (child !== this.topBand && child !== this.bottomBand) {
        child.alpha = alpha;
      }
    }
  }

  override onFit({ windowWidth, windowHeight, scale }: Fit): void {
    const visibleWidth = windowWidth / scale;
    const visibleHeight = windowHeight / scale;
    const period = BAND_PATTERN[0].length * BAND_CELL;
    // Whole repeats either side of the centre, so the pattern stays symmetrical.
    const repeats = Math.ceil(visibleWidth / period / 2) * 2;
    const rows = BAND_PATTERN.map((row) => row.repeat(repeats));
    const left = (DESIGN_WIDTH - repeats * period) / 2;
    const top = (DESIGN_HEIGHT - visibleHeight) / 2;

    for (const band of [this.topBand, this.bottomBand]) {
      weave(band.clear(), rows, BAND_COLORS, left, 0, BAND_CELL);
    }

    this.topBand.y = top;
    this.bottomBand.y = top + visibleHeight - BAND_HEIGHT;
  }
}
