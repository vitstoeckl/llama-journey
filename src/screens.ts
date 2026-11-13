import { Container, Ticker } from 'pixi.js';
import type { Fit } from './layout';
import { reducedMotion } from './motion';

const FADE_MS = 180;

/** One full page of the game. Draw it in design coordinates (see layout.ts). */
export class Screen extends Container {
  /** Called when the screen is shown and whenever the window changes size. */
  onFit(_fit: Fit): void {}

  /** Called while the screen fades in, from 0 to 1. */
  setFade(alpha: number): void {
    this.alpha = alpha;
  }
}

/** Shows one screen at a time and destroys the previous one. */
export class ScreenManager {
  private readonly root: Container;
  private fit: Fit;
  private current: Screen | null = null;
  private stopFade: (() => void) | null = null;

  constructor(root: Container, fit: Fit) {
    this.root = root;
    this.fit = fit;
  }

  /** Pass `fade: false` when the new screen is the same page with a small change. */
  show(next: Screen, { fade = true }: { fade?: boolean } = {}): void {
    // Screens usually switch from a button's tap handler. Waiting for that handler
    // to finish means PixiJS is not still dispatching the event to a destroyed button.
    queueMicrotask(() => {
      this.stopFade?.();
      this.current?.destroy({ children: true });
      this.current = next;
      this.root.addChild(next);
      next.onFit(this.fit);

      if (fade && !reducedMotion()) {
        this.fadeIn(next);
      }
    });
  }

  private fadeIn(screen: Screen): void {
    let elapsed = 0;
    const update = (ticker: Ticker) => {
      elapsed += ticker.deltaMS;
      screen.setFade(Math.min(1, elapsed / FADE_MS));

      if (elapsed >= FADE_MS) {
        this.stopFade?.();
      }
    };

    this.stopFade = () => {
      Ticker.shared.remove(update);
      this.stopFade = null;
    };
    screen.setFade(0);
    Ticker.shared.add(update);
  }

  resize(fit: Fit): void {
    this.fit = fit;
    this.current?.onFit(fit);
  }
}
