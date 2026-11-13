import { Graphics } from 'pixi.js';
import type { Language } from './i18n';
import { INDIGO } from './theme';

const WIDTH = 60;
const HEIGHT = 40;
const BORDER = 2;

const WHITE = 0xffffff;
const PERU_RED = 0xd91023;
const CZECH_RED = 0xd7141a;
const CZECH_BLUE = 0x11457e;
const US_RED = 0xb22234;
const US_BLUE = 0x3c3b6e;
const US_STRIPES = 13;
const US_STAR_ROWS = 4;
const US_STAR_COLUMNS = 5;
const US_STAR_RADIUS = 1.1;
const GERMAN_BLACK = 0x000000;
const GERMAN_RED = 0xdd0000;
const GERMAN_GOLD = 0xffcc00;
const JAPAN_RED = 0xbc002d;

const DRAW: Record<Language, (flag: Graphics) => void> = {
  // The class is in Peru and the game is about it, so Spanish flies Peru's flag.
  es: (flag) => {
    flag.rect(0, 0, WIDTH, HEIGHT).fill(WHITE);
    flag.rect(0, 0, WIDTH / 3, HEIGHT).fill(PERU_RED);
    flag.rect((WIDTH * 2) / 3, 0, WIDTH / 3, HEIGHT).fill(PERU_RED);
  },
  cs: (flag) => {
    flag.rect(0, 0, WIDTH, HEIGHT / 2).fill(WHITE);
    flag.rect(0, HEIGHT / 2, WIDTH, HEIGHT / 2).fill(CZECH_RED);
    flag.poly([0, 0, WIDTH / 2, HEIGHT / 2, 0, HEIGHT]).fill(CZECH_BLUE);
  },
  en: (flag) => {
    const stripe = HEIGHT / US_STRIPES;
    const cantonWidth = WIDTH * 0.42;
    const cantonHeight = stripe * 7;

    flag.rect(0, 0, WIDTH, HEIGHT).fill(WHITE);

    for (let index = 0; index < US_STRIPES; index += 2) {
      flag.rect(0, index * stripe, WIDTH, stripe).fill(US_RED);
    }

    flag.rect(0, 0, cantonWidth, cantonHeight).fill(US_BLUE);

    // Too small for 50 real stars, so a grid of dots stands in for them.
    for (let row = 0; row < US_STAR_ROWS; row++) {
      for (let column = 0; column < US_STAR_COLUMNS; column++) {
        flag
          .circle(
            ((column + 0.5) * cantonWidth) / US_STAR_COLUMNS,
            ((row + 0.5) * cantonHeight) / US_STAR_ROWS,
            US_STAR_RADIUS,
          )
          .fill(WHITE);
      }
    }
  },
  de: (flag) => {
    flag.rect(0, 0, WIDTH, HEIGHT / 3).fill(GERMAN_BLACK);
    flag.rect(0, HEIGHT / 3, WIDTH, HEIGHT / 3).fill(GERMAN_RED);
    flag.rect(0, (HEIGHT * 2) / 3, WIDTH, HEIGHT / 3).fill(GERMAN_GOLD);
  },
  ja: (flag) => {
    flag.rect(0, 0, WIDTH, HEIGHT).fill(WHITE);
    flag.circle(WIDTH / 2, HEIGHT / 2, (HEIGHT * 3) / 10).fill(JAPAN_RED);
  },
};

/** A language's flag, centred on its origin, with a thin border so white shows on a pale button. */
export function createFlag(language: Language): Graphics {
  const flag = new Graphics();

  flag.rect(-BORDER, -BORDER, WIDTH + 2 * BORDER, HEIGHT + 2 * BORDER).fill(INDIGO);
  DRAW[language](flag);
  flag.pivot.set(WIDTH / 2, HEIGHT / 2);

  return flag;
}
