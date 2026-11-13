import type { Graphics } from 'pixi.js';

// Generated once from Natural Earth (public domain) land shapes, in a Mercator projection.
// Each character is one square. Capital and small letters are two shades of the same land.
/** Cell size in design units. The map is 720 wide, the whole width of the design area. */
export const MAP_CELL = 8;
export const MAP_ROWS = [
  '......................ooooo...oooooooo....................................................',
  '....................oooooooo.ooooIiIooo...................................................',
  '...................ooooIIioooooiIIIiioo...................................................',
  '..................oooiiIIIiooooiIIIiiooo.........................ooo......................',
  '.................oooiIiIiIoIiiIIiIiiooooo...............ooo.....ooooo.....................',
  '................ooooiiiiiioIiiiiiiiIiiioo.....oooo.....ooooo....ooioo.....................',
  '...............oooiioooIioiiiIIiiIIIiiooo...ooooooo....ooIoo...oooIoo.....................',
  '.............ooooiiiIiIIioiIIIIIiIiiIooo...ooooIioo....ooooo...ooIiooo....................',
  '............ooooiooiioiiooIiiiiIIIiIiIoo...ooIooooo.....ooo....oooioooo...................',
  '...........oooioIIIioIiiIiIiIiIIiIiiiooo...ooooooo........ooo...ooooioo...................',
  '..........ooooIoooIooiIooiiIIIiiiiIiioo.....ooioo.......oooooo..ooooiooo....oooo..........',
  '..........ooioooIoioIiIooiIiIiIiiiiIIooo....ooooo......ooooioo.oooooiIooo..oooooo.........',
  '..........oooiIioIoioiooooooiiIIIIiiiIoo.....ooo......oooIiooooooiiiIiIooooooiIoo.........',
  '.........oooooioooooIiooooooIIiiIiIIIIoo..............ooioooooooiiiIIIooooooooooo.........',
  '..ooo....ooiIIoooIoIioioooooiIiIIIiioooooo............ooIooooooiiIiIIoiioiooooooo.....ooo.',
  '.ooooooo.ooiiIiooiooiioIoooooIiIiiIIooooooo...ooooo...ooooooiooiIIIIiIiIiIiooIiooooooooooo',
  'ooouoooooooooiiIooiooiIiIooooiIiiIiIiooouoo..ooooooooooouooUUUuuuuUuUUUuuuuuuUUuoooooooUoo',
  'oouuuuuooouooIiiioIooooIiiooooIIiiIIIoooooo..ooUuuooooooououUuUuUuuuUuuuuUUuuuuUUUoouUUooo',
  'oUUUuuUUUuuIiIoioooIiiooIIoooiiIiiiooooooo..ooouUUUUouoUuuUuUUUuUUUUuUUuuUuuUUUuuUUuuuUuoo',
  'oouuUUuUuUUUuuuouUuuuuooiiiooiiiIiooooooo...ooUUuUUUuoUuuUUuouuuuuUuUuUuuUUuuuUUuUUUUUuUuU',
  'oUUUuUUUUuUUuUUuUUUUuoouiiIooIiiIooooiIoo..oooUuoUUouuUuuUuuUuUUuuuUuuuUuUUuuuuUUUUUUuuuoo',
  'oouUUuuUuuUuUUuUuuUuoooooIooooiIooooooooo.ooouUoUuUuuUUuUUuUUuUuUUUuUUUuuUUUuuuUUUUuUuUooo',
  'ofFFFFfFFFFfFFFFfFfoooFfooooooIioo..oooo..ooFffoFfFFFFFfFffFfFFffFfFfFFffFFfFFfFFFoffFoooo',
  'ooffoooofFFffffFFffooooFIoiooooooo......ooooFFfooofFfFFfFfFFfFfffFfffFFFffFffFfFfooooooo.o',
  'oooFooooFFFfFFfffffooooffFFoooooo......ooooooFFooFFfFfFFFFfFFFfFFFfFFFfFffFFfoooooFoooo...',
  '.ooooooooofFFffFffFfFooffFfoooo.......oooFoooFoofffFfFfffFFFffffffFfFfFFFFfffooooFfoo.....',
  '..ooo..oofFFffFfFffFffoffffffoo.......oofffoFffffFfffffFfFFfFfFFfFfffFfFffFFffoooofoo.....',
  '.......oooFFFFFfFffFFfFFfFFfooo.......ooofofFfFFffFFffffffFFFFfFfFfffffFfFfFFfooofooo.....',
  '........oooFffffFffffFFffFooFoo........oofFFfffFFFFFFfffFFffFFffffFffffffFfFFooooooo......',
  '.........oootTTTSSSTTtTTTtooooo.......ooootTtTTTTToTTTobbBbbBbbbbbbBbBbBttTTtooTooo.......',
  '.........oottTtTSssttTTttooooo........ooTTtooToTTooooTboBBbbBBBBBbBBBbBbtTtooToooo........',
  '.........oootyYYyYsTttttooo...........oottooooTToTTttTbobbBbBBBBbbbBBBbBooooooooo.........',
  '..........ooTyYYyYstTTTtoo............oooooTtooootoTtTbBBBbbBbbBbbBbBbbBTotootoo..........',
  '..........oooyYyYystTtTooo............ooYYyYyYoooooTtTbBBbbbBbbBBbbBbbBbtooooooo..........',
  '...........oooyyyYsoooooo............oooyyyyyyYyYYyYyyoYYyBBBbBbBBbBbbbBtoooooo...........',
  '............ooYyYyoooooooo..........oooyyyyYyYyyyYYoYyyooYBbBBbBbBBbBbbbooo...............',
  '............ooooyyoooTToooo.........ooyyyYYYyYYYyyYYyYYyYooosSsSsTttTTtooo................',
  '.............ooooTTttoooToo.........ooYYYYYYYYYyYyyyoYyyYoooosSsootTtoooooo...............',
  '...............ooooFFFooooooo.......oossssSsssSsSssYYyYoooooossoooofFfoooooo..............',
  '................oooooFoofoooooo.....ooossssSSSsSSSSSSoFooo.oosoooooofFoooFoo..............',
  '..................oooooffFFfoooo.....ooofFFFFfFFfFfffffoo..ooofoooofoooooFoooo............',
  '....................oooFFffFfFoooo....oooooooFfFFfFfFfooo...ooooooooooofoooooooo..........',
  '....................ooffFFfFffFoooo....ooooooFFffFFFfooo.....ooo..oofoFffooffoooo.........',
  '....................oofBBbfFfFFffooo.......ooossssssooo...........ooFooofooooFFooo........',
  '....................ooobbBfsSSsSSFoo........oossSSSsoooo..........ooooooooooooofoo....ooo.',
  '.....................ooBBbfsSSSsSooo.......ooosSSssSsoooo..........ooo.ooooSSooooo...ooooo',
  '.....................oooBbTsssSSsoo........oossssSSSooToo.............oooSSSsoSooo...ootoo',
  '......................ooobtSssssooo........oooYyyssoootoo............oooYYYyYYysoo...ooooo',
  '.......................ooBtsSssooo..........ooYYYSSooSooo............ooyyyYYYYYsooo...ooo.',
  '.......................oobTsSsooo...........ooYYySsooooo.............ooyYYYyYYYSsoo.......',
  '......................ooobTssSoo............oooSSSooooo..............ooyYYYYyyysSoo..ooo..',
  '......................oobBtsSooo.............ooSoooo.................oosooooosSsooo.ooooo.',
  '......................ooBBTtooo..............oooooo..................oooooooooSooo..ooToo.',
  '......................ooBBTooo................ooo.....................ooo...oootoo.oooToo.',
  '......................oobbooo................................................ooooooootooo.',
  '......................ooBbooo.................................................ooo.ooTooo..',
  '......................ooBboooo....................................................ooooo...',
  '......................oobooToo.....................................................ooo....',
  '......................oootoooo............................................................',
  '.......................oooooo.............................................................',
  '........................ooo...............................................................',
  '..........................................................................................',
  '.........................ooo..........................ooo..........ooooo..................',
  '........................ooooo........................ooooooo..oooooooooooooooooo..........',
  '.......................oooioo......................ooooIooooooooooooIoioooooooooooo.......',
  '......................ooooooo.....................ooooIIiIiooooIIIIIiIIIIIiiiIiooooo......',
  '......................ooioIoo.....................ooiiiiIiIIooIiIiiiIIiiIiIIiiIIIIoo......',
];

export const MAP_HEIGHT = MAP_ROWS.length * MAP_CELL;
export const MAP_WIDTH = MAP_ROWS[0].length * MAP_CELL;
const LEFT_LONGITUDE = -170;
const TOP_LATITUDE = 84;

const DEEP_OCEAN = 0x0c3157;
const MAP_COLORS: Record<string, number> = {
  o: 0x25527f,
  I: 0xdfeced,
  i: 0xc9dedf,
  U: 0x5f7f55,
  u: 0x6f8f62,
  F: 0x24401c,
  f: 0x2e4d22,
  T: 0x47682b,
  t: 0x567833,
  S: 0x7f8332,
  s: 0x93903a,
  B: 0xa17e55,
  b: 0xb08c5f,
  Y: 0xcb9b3b,
  y: 0xd9a944,
};

function mercator(latitude: number): number {
  return Math.asinh(Math.tan((latitude * Math.PI) / 180));
}

/** Where a place falls on the map, in design units from the map's top left corner. */
export function mapPoint(longitude: number, latitude: number): { x: number; y: number } {
  const perRadian = MAP_WIDTH / (2 * Math.PI);

  return {
    x: (((longitude - LEFT_LONGITUDE + 360) % 360) / 360) * MAP_WIDTH,
    y: (mercator(TOP_LATITUDE) - mercator(latitude)) * perRadian,
  };
}

/** Flat squares, joined into runs of one colour, with the ocean behind them. */
export function drawWorldMap(graphics: Graphics, height: number): Graphics {
  graphics.rect(0, 0, MAP_WIDTH, height).fill(DEEP_OCEAN);

  for (const [code, color] of Object.entries(MAP_COLORS)) {
    MAP_ROWS.forEach((row, rowIndex) => {
      for (let start = row.indexOf(code); start !== -1; ) {
        let end = start + 1;

        while (row[end] === code) {
          end++;
        }

        graphics.rect(start * MAP_CELL, rowIndex * MAP_CELL, (end - start) * MAP_CELL, MAP_CELL);
        start = row.indexOf(code, end);
      }
    });
    graphics.fill(color);
  }

  return graphics;
}
