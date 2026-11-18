import { ALPACA, CHILCA, INDIGO, MADDER, MAIZE } from './theme';
import type { Country } from './questions';

const SPIRE = 0x7b84a6;
const STONE = 0xe0c9a3;
const VERMILION = 0xe2452f;
const GLASS = 0x8fd3e8;
const PALE_GLASS = 0xd6f1f7;
const CRUST = 0xb9762f;
const PINK = 0xf6a8c4;
const BARK = 0x9c6b3f;
const SNOW_ROCK = 0x56608f;

/** The colours every pattern in this file draws with. */
export const ART_COLORS = {
  W: ALPACA,
  Y: MAIZE,
  S: SPIRE,
  I: INDIGO,
  M: MADDER,
  R: VERMILION,
  T: STONE,
  G: CHILCA,
  A: GLASS,
  a: PALE_GLASS,
  C: CRUST,
  P: PINK,
  K: BARK,
  N: SNOW_ROCK,
};

const COLUMN_ROW = '..WW..WW..WW..WW..WW..WW..';

/** Each country's best-known landmark, drawn large. */
export const COUNTRY_LANDMARKS: Record<Country, { rows: string[]; cell: number }> = {
  // Prague's Týn Church: twin spires, each ringed by smaller ones.
  czechia: {
    cell: 13,
    rows: [
      '.....Y.............Y.....',
      '.....S.............S.....',
      '....SSS...........SSS....',
      '....SSS...........SSS....',
      '.Y..SSS..Y.....Y..SSS..Y.',
      '.S.SSSSS.S.....S.SSSSS.S.',
      'SSSSSSSSSSS...SSSSSSSSSSS',
      'SSSSSSSSSSS...SSSSSSSSSSS',
      '.SSSSSSSSS.....SSSSSSSSS.',
      '.WWWWWWWWW.....WWWWWWWWW.',
      '.WWIWWWIWW..Y..WWIWWWIWW.',
      '.WWIWWWIWW.WWW.WWIWWWIWW.',
      '.WWWWWWWWWWWWWWWWWWWWWWW.',
      '.WWIWWWIWWWIIIWWWIWWWIWW.',
      '.WWIWWWIWWWIIIWWWIWWWIWW.',
      '.WWWWWWWWWWWWWWWWWWWWWWW.',
      '.WWWWWWWMMMMMMMMMWWWWWWW.',
      '.WWIWWWWMIIMMMIIMWWWWIWW.',
      '.WWIWWWWMIIMMMIIMWWWWIWW.',
      '.WWWWWWWMMMMMMMMMWWWWWWW.',
    ],
  },
  // Berlin's Brandenburg Gate.
  germany: {
    cell: 12,
    rows: [
      '.........YYYYYYYY.........',
      '..........YYYYYY..........',
      '........YYYYYYYYYY........',
      '....WWWWWWWWWWWWWWWWWW....',
      '..WWWWWWWWWWWWWWWWWWWWWW..',
      '.WWWWWWWWWWWWWWWWWWWWWWWW.',
      '.SSSSSSSSSSSSSSSSSSSSSSSS.',
      ...Array<string>(11).fill(COLUMN_ROW),
      '.SSSSSSSSSSSSSSSSSSSSSSSS.',
    ],
  },
  // Tokyo Tower, in its red and white bands.
  japan: {
    cell: 12,
    rows: [
      '...........R...........',
      '...........W...........',
      '...........R...........',
      '...........W...........',
      '..........RRR..........',
      '.........WWWWW.........',
      '..........RRR..........',
      '..........RRR..........',
      '.........RR.RR.........',
      '.........WW.WW.........',
      '........RR...RR........',
      '........RRRRRRR........',
      '.......RR.....RR.......',
      '.....WWWWWWWWWWWWW.....',
      '.....RRRRRRRRRRRRR.....',
      '......RR.......RR......',
      '......WW.......WW......',
      '.....RRR.......RRR.....',
      '.....RR.R.....R.RR.....',
      '....WWW..R...R..WWW....',
      '....RR....RRR....RR....',
      '...RRR...RR.RR...RRR...',
      '..RRR...RR...RR...RRR..',
      '.RRR...RR.....RR...RRR.',
    ],
  },
};

const BEER = [
  '..WWWWWWW.....',
  '.WWWWWWWWW....',
  '.YYYYYYYYY....',
  '.YYYYYYYYYTTT.',
  '.YYYYYYYYYT..T',
  '.YYYYYYYYYT..T',
  '.YYYYYYYYYT..T',
  '.YYYYYYYYYTTT.',
  '.YYYYYYYYY....',
  '.YYYYYYYYY....',
];
/** Three soft mochi on a dish. */
const MOCHI = [
  '.PP...WW...GG.',
  'PPPP.WWWW.GGGG',
  'PPPP.WWWW.GGGG',
  '.PP...WW...GG.',
  'TTTTTTTTTTTTTT',
  '.TTTTTTTTTTTT.',
];
/** A Nikkei dish: fish, red onion and lime in a bowl, with chopsticks. */
const NIKKEI_DISH = [
  '.........K..K.',
  '........K..K..',
  '..PWWGPWK.K...',
  '.WPWWPGWWPW...',
  'RRRRRRRRRRRRRR',
  '.RRRRRRRRRRRR.',
  '..RRRRRRRRRR..',
  '....TTTTTT....',
];
const MOUNT_FUJI = [
  '.....WWWW.....',
  '....WWWWWW....',
  '...WWNWWNWW...',
  '...WNNWNNWW...',
  '..NNNNNNNNNN..',
  '.NNNNNNNNNNNN.',
  'NNNNNNNNNNNNNN',
];

export const SHOE = [
  '..KKKK........',
  '..KYKK........',
  '..KKYKK.......',
  '..KKKYKKK.....',
  '..KKKKKKKKKK..',
  '.KKKKKKKKKKKK.',
  '.WWWWWWWWWWWW.',
];
export const DOG_BOWL = [
  '.....CKCC.....',
  '...CCCCKCCC...',
  '..CKCCCCCKCC..',
  'RRRRRRRRRRRRRR',
  '.RRWRRRRRRWRR.',
  '.RRRWWWWWWRRR.',
  '.RRWRRRRRRWRR.',
  '.RRRRRRRRRRRR.',
  'RRRRRRRRRRRRRR',
];
const CASTLE = [
  '.S.S.....S.S..',
  '.SSS.....SSS..',
  '.SSS.S.S.SSS..',
  '.SSSSSSSSSSS..',
  '.SISSSSSSSIS..',
  '.SSSSSSSSSSS..',
  '.SSSSKKKSSSS..',
  '.SSSSKKKSSSS..',
];
export const POTATO = [
  '....CCCCCC....',
  '..CCCCCCCCCC..',
  '.CCKCCCCCCCCC.',
  '.CCCCCCCKCCCC.',
  '.CCCCKCCCCCKC.',
  '..CCCCCCCCCC..',
  '....CCCCCC....',
];
const COMPASS = [
  '....YYYYYY....',
  '..YYWWWWWWYY..',
  '.YYWWWRRWWWYY.',
  '.YWWWWRRWWWWY.',
  '.YWWWRRRRWWWY.',
  '.YWWWSSSSWWWY.',
  '.YWWWWSSWWWWY.',
  '.YYWWWSSWWWYY.',
  '..YYWWWWWWYY..',
  '....YYYYYY....',
];
export const ANCIENT_POT = [
  '.....MMMM.....',
  '......MM......',
  '.....MMMM.....',
  '...MMMMMMMM...',
  '..MMTTMMTTMM..',
  '.MMTTMMTTMMMM.',
  '.MMMMMMMMMMMM.',
  '..MMTTMMTTMM..',
  '...MMMMMMMM...',
  '....MMMMMM....',
];
/** Pozuzo's house. No longer a tile, but kept for the spare Pozuzo question's scene. */
export const TIMBERED_HOUSE = [
  '......RR......',
  '.....RRRR.....',
  '...RRRRRRRR...',
  '..RRRRRRRRRR..',
  '.RRRRRRRRRRRR.',
  '..KWWKWWKWWK..',
  '..KKWWKWWKKK..',
  '..KWWKWWKWWK..',
  '..KKKKKKKKKK..',
  '..KWAWKKWAWK..',
];
/** A "16+" age sign. */
const AGE_SIGN = [
  'RRRRRRRRRRRRR',
  'RWKWWKKKWWWWR',
  'RKKWWKWWWWKWR',
  'RWKWWKKKWKKKR',
  'RWKWWKWKWWKWR',
  'RKKKWKKKWWWWR',
  'RRRRRRRRRRRRR',
];
export const CAR = [
  '.....RRRRR....',
  '....RAAaAAR...',
  '...RAAAaAAAR..',
  'RRRRRRRRRRRRRR',
  'MRRRRRRRRRRRRY',
  'RRRRRRRRRRRRRR',
  '..NNN....NNN..',
  '..NNN....NNN..',
];
const STEIN = [
  '..SSSSSSSSS...',
  '..WWWWWWWWW...',
  '..TTTTTTTTTSS.',
  '..TKTTKTTKTS.S',
  '..TKTTKTTKTS.S',
  '..TKTTKTTKTS.S',
  '..TTTTTTTTTSS.',
  '..TTTTTTTTT...',
  '..SSSSSSSSS...',
];
/** A maki with the nori outside next to an uramaki with the rice outside, on a board. */
const MAKI_ROLLS = [
  '..KKKK...WWWW.',
  '.KWWWWK.WKKKKW',
  '.KWPPWK.WKPGKW',
  '.KWGPWK.WKGPKW',
  '.KWWWWK.WKKKKW',
  '..KKKK...WWWW.',
  'CCCCCCCCCCCCCC',
];

export const THINGS_PER_COUNTRY = 4;

/** Four things for each country, one per question and in question order, matching the labels in the language files. */
export const COUNTRY_THINGS: Record<Country, [string[], string[], string[], string[]]> = {
  czechia: [BEER, SHOE, CASTLE, POTATO],
  germany: [AGE_SIGN, CAR, COMPASS, STEIN],
  japan: [MAKI_ROLLS, MOCHI, NIKKEI_DISH, MOUNT_FUJI],
};
