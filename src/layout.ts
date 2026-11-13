import type { Container } from 'pixi.js';

/**
 * Every screen is drawn in these portrait coordinates, whatever the phone.
 * 9:16 is close to what a phone browser shows once its toolbars are subtracted.
 */
export const DESIGN_WIDTH = 720;
export const DESIGN_HEIGHT = 1280;

export interface Fit {
  /** Size of the visible window, in CSS pixels. */
  windowWidth: number;
  windowHeight: number;
  /** CSS pixels per design unit. */
  scale: number;
}

/** Scales and centres `root` so the whole design area fits, undistorted, in the window. */
export function fitToWindow(root: Container, windowWidth: number, windowHeight: number): Fit {
  const scale = Math.min(windowWidth / DESIGN_WIDTH, windowHeight / DESIGN_HEIGHT);

  root.scale.set(scale);
  root.position.set(
    (windowWidth - DESIGN_WIDTH * scale) / 2,
    (windowHeight - DESIGN_HEIGHT * scale) / 2,
  );

  return { windowWidth, windowHeight, scale };
}
