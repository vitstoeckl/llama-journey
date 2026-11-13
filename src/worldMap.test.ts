import { describe, expect, it } from 'vitest';
import { mapPoint, MAP_CELL, MAP_ROWS, MAP_WIDTH } from './worldMap';

const OCEAN = new Set(['.', 'o']);

function isLandNear(longitude: number, latitude: number): boolean {
  const { x, y } = mapPoint(longitude, latitude);
  const column = Math.floor(x / MAP_CELL);
  const row = Math.floor(y / MAP_CELL);

  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = column - 1; c <= column + 1; c++) {
      if (!OCEAN.has(MAP_ROWS[r][c])) {
        return true;
      }
    }
  }

  return false;
}

describe('world map', () => {
  it('has rows of equal length, the full width of the design area', () => {
    for (const row of MAP_ROWS) {
      expect(row.length * MAP_CELL).toBe(MAP_WIDTH);
    }

    expect(MAP_WIDTH).toBe(720);
  });

  it.each([
    ['Lima', -77.04, -12.05],
    ['Prague', 14.44, 50.08],
    ['Berlin', 13.4, 52.52],
    ['Tokyo', 139.69, 35.68],
  ])('puts %s on land', (_, longitude, latitude) => {
    expect(isLandNear(longitude, latitude)).toBe(true);
  });

  it('keeps the middle of the Pacific as ocean', () => {
    expect(isLandNear(-150, 0)).toBe(false);
  });
});
