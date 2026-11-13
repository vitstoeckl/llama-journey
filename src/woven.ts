import { Graphics } from 'pixi.js';
import { CELL } from './theme';

/** Maps each character of a pattern to a colour. Any other character is left empty. */
export type WovenColors = Record<string, number>;

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Draws a pattern of equal-length strings as cloth: solid blocks of colour, crossed by
 * a darker line along each row and a lighter thread on every other cell.
 */
export function weave(
  graphics: Graphics,
  rows: readonly string[],
  colors: WovenColors,
  x = 0,
  y = 0,
  cell = CELL,
): Graphics {
  const blocks = new Map<number, Rect[]>();
  const threads = new Map<number, Rect[]>();
  const add = (layer: Map<number, Rect[]>, color: number, rect: Rect) => {
    const rects = layer.get(color);

    if (rects) {
      rects.push(rect);
    } else {
      layer.set(color, [rect]);
    }
  };
  const weftHeight = Math.max(1, Math.round(cell * 0.14));
  const warpWidth = Math.round(cell * 0.5);

  rows.forEach((row, rowIndex) => {
    const top = y + rowIndex * cell;
    let column = 0;

    while (column < row.length) {
      const color = colors[row[column]];
      let end = column + 1;

      // Joining a run of equal cells avoids hairline gaps when the game is scaled down.
      while (end < row.length && row[end] === row[column]) {
        end++;
      }

      if (color !== undefined) {
        const left = x + column * cell;
        const width = (end - column) * cell;

        add(blocks, color, { x: left, y: top, width, height: cell });
        add(threads, mix(color, 0x000000, 0.18), {
          x: left,
          y: top + cell - weftHeight,
          width,
          height: weftHeight,
        });

        for (let c = column; c < end; c++) {
          if ((c + rowIndex) % 2 === 0) {
            add(threads, mix(color, 0xffffff, 0.14), {
              x: x + c * cell + (cell - warpWidth) / 2,
              y: top,
              width: warpWidth,
              height: cell - weftHeight,
            });
          }
        }
      }

      column = end;
    }
  });

  for (const layer of [blocks, threads]) {
    for (const [color, rects] of layer) {
      for (const rect of rects) {
        graphics.rect(rect.x, rect.y, rect.width, rect.height);
      }

      graphics.fill(color);
    }
  }

  return graphics;
}

function mix(color: number, target: number, amount: number): number {
  const channel = (shift: number) => {
    const from = (color >> shift) & 0xff;
    const to = (target >> shift) & 0xff;

    return Math.round(from + (to - from) * amount) << shift;
  };

  return channel(16) | channel(8) | channel(0);
}
