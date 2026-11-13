import { Ticker, type Container } from 'pixi.js';

export function reducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function easeInOut(progress: number): number {
  return (1 - Math.cos(Math.PI * progress)) / 2;
}

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/** Grows from nothing, overshoots a little, and settles at 1. */
export function popScale(progress: number): number {
  const back = clamp01(progress) - 1;

  return 1 + 2.7 * back ** 3 + 1.7 * back ** 2;
}

/**
 * Calls `step` with 0 to 1 over `ms`, after waiting `delayMs`, and stops if `owner` is destroyed.
 * Phones set to reduce motion go straight to the end.
 */
export function animate(owner: Container, ms: number, step: (progress: number) => void, delayMs = 0): void {
  if (reducedMotion()) {
    step(1);

    return;
  }

  let elapsed = -delayMs;
  const update = (ticker: Ticker) => {
    elapsed += ticker.deltaMS;
    step(clamp01(elapsed / ms));

    if (elapsed >= ms) {
      Ticker.shared.remove(update);
    }
  };

  step(0);
  Ticker.shared.add(update);
  owner.once('destroyed', () => Ticker.shared.remove(update));
}
