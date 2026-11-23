import { ALPACA, INDIGO, MAIZE } from './theme';

/** A colour from the theme, as CSS. */
export const css = (color: number) => `#${color.toString(16).padStart(6, '0')}`;

/** A guinea pig in a chullo, the Andean knitted hat, facing right. */
export const CUY = [
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

export const CUY_COLORS: Record<string, string> = {
  B: '#9c6b3f',
  W: css(ALPACA),
  E: '#23201f',
  P: '#f6a8c4',
  R: '#e2452f',
  Y: css(MAIZE),
  I: css(INDIGO),
};
