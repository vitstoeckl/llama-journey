import { Container, Graphics, Ticker } from 'pixi.js';
import { ART_COLORS } from './countryArt';
import { reducedMotion } from './motion';
import { weave } from './woven';

/** Draws one question's picture in place of the map. `done` is true once the player has answered. */
export type QuestionScene = (width: number, height: number, done: boolean) => Container;

export const SCENE_COLORS = {
  ...ART_COLORS,
  B: 0x23201f,
  D: 0x0f4a30,
  F: 0xf08a5c,
  H: 0x2f7fc1,
  L: 0x9ccf3a,
  O: 0xf08a3c,
  V: 0x7a2a8c,
};

export const PERU_FLAG = ['RRWWRR', 'RRWWRR', 'RRWWRR', 'RRWWRR'];
export const GERMAN_FLAG = ['BBBBBB', 'BBBBBB', 'RRRRRR', 'RRRRRR', 'YYYYYY', 'YYYYYY'];
export const AUSTRIAN_FLAG = ['RRRRRR', 'RRRRRR', 'WWWWWW', 'WWWWWW', 'RRRRRR', 'RRRRRR'];
export const JAPANESE_FLAG = ['WWWWWW', 'WWRRWW', 'WWRRWW', 'WWWWWW'];

const POLE_WIDTH = 3;
const SMOKE_MS = 2400;
const SMOKE_RISE = 44;
const SMOKE_SIZE = 10;

/** A pattern drawn as one piece that can be moved around a scene. */
export function piece(rows: readonly string[], cell: number, x = 0, y = 0): Graphics {
  const drawn = weave(new Graphics(), rows, SCENE_COLORS, 0, 0, cell);

  drawn.position.set(x, y);

  return drawn;
}

/** The same, but it turns and scales around its middle, and `x` and `y` place that middle. */
export function centredPiece(rows: readonly string[], cell: number, x = 0, y = 0): Graphics {
  const drawn = piece(rows, cell, x, y);

  drawn.pivot.set((rows[0].length * cell) / 2, (rows.length * cell) / 2);

  return drawn;
}

/** The pattern of a round sun: a disc of `color`, which is a letter of SCENE_COLORS. */
export function disc(radius: number, color: string): string[] {
  const size = 2 * radius;

  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, column) =>
      (row + 0.5 - radius) ** 2 + (column + 0.5 - radius) ** 2 <= radius ** 2 ? color : '.',
    ).join(''),
  );
}

/** A flag on a pole, with the foot of the pole at `x` and `y`. */
export function flagPole(rows: readonly string[], cell: number, x: number, y: number, poleHeight: number): Container {
  const pole = new Container();

  pole.position.set(x, y - poleHeight);
  pole.addChild(new Graphics().rect(0, 0, POLE_WIDTH, poleHeight).fill(ART_COLORS.S), piece(rows, cell, POLE_WIDTH, 0));

  return pole;
}

/** A pixel mountain: stepped sides, with its foot on `base`. */
export function peak(
  graphics: Graphics,
  centre: number,
  base: number,
  height: number,
  halfWidth: number,
  color: number,
  step = 8,
): Graphics {
  for (let top = 0; top < height; top += step) {
    const half = Math.round((halfWidth * (top + step)) / height / step) * step;

    graphics.rect(centre - half, base - height + top, 2 * half, step).fill(color);
  }

  return graphics;
}

/** Puffs that rise from one point and fade. Call `update` with the scene's time. */
export function createSmoke(x: number, y: number, count = 4): { view: Container; update: (elapsed: number) => void } {
  const view = new Container();
  const puffs = Array.from({ length: count }, () =>
    view.addChild(new Graphics().rect(-SMOKE_SIZE / 2, -SMOKE_SIZE / 2, SMOKE_SIZE, SMOKE_SIZE).fill(ART_COLORS.W)),
  );

  view.position.set(x, y);

  return {
    view,
    update(elapsed) {
      puffs.forEach((puff, index) => {
        const rise = (elapsed / SMOKE_MS + index / count) % 1;

        puff.position.set(Math.sin(rise * 6 + index) * 6, -rise * SMOKE_RISE);
        puff.alpha = 1 - rise;
        puff.scale.set(0.6 + rise);
      });
    },
  };
}

/** A band of sea crests that scrolls with `update`, covering `width`. */
export function createWaves(
  width: number,
  y: number,
  color: number,
  gap: number,
): { view: Graphics; update: (offset: number) => void } {
  const view = new Graphics();

  for (let x = -gap; x < width + gap; x += gap) {
    view.rect(x, y, Math.round(gap / 2), 4).fill(color);
  }

  return {
    view,
    update(offset) {
      view.x = offset % gap;
    },
  };
}

/**
 * Runs `frame` with the time in ms until the scene is destroyed. Phones set to reduce motion
 * get one still picture, the one at `restMs`.
 */
export function play(scene: Container, frame: (elapsed: number) => void, restMs: number): void {
  if (reducedMotion()) {
    frame(restMs);

    return;
  }

  let elapsed = 0;
  const update = (ticker: Ticker) => {
    elapsed += ticker.deltaMS;
    frame(elapsed);
  };

  frame(0);
  Ticker.shared.add(update);
  scene.once('destroyed', () => Ticker.shared.remove(update));
}
