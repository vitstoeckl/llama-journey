import { Container, Graphics, Ticker, type DestroyOptions } from 'pixi.js';
import { reducedMotion } from './motion';
import { ALPACA, CHILCA, COCHINEAL, MAIZE } from './theme';

const STONE = 0xe0c9a3;
const VERMILION = 0xe2452f;
const COLORS = [MAIZE, ALPACA, CHILCA, COCHINEAL, VERMILION, STONE];

const RAIN_LIFE_MS = 1900;
const BURST_LIFE_MS = 900;

interface Particle {
  piece: Graphics;
  vx: number;
  vy: number;
  gravity: number;
  spin: number;
  age: number;
  life: number;
}

/** Pieces of coloured paper. Phones set to reduce motion show none. */
export class Confetti extends Container {
  private readonly particles: Particle[] = [];
  private thrown = 0;

  constructor() {
    super();
    Ticker.shared.add(this.update, this);
  }

  override destroy(options?: DestroyOptions): void {
    Ticker.shared.remove(this.update, this);
    super.destroy(options);
  }

  /** Falls from above the top edge, across `width`. */
  rain(count: number, width: number): void {
    for (let index = 0; index < count; index++) {
      this.add(Math.random() * width, -20 - Math.random() * 200, (Math.random() - 0.5) * 0.15, 0.2 + Math.random() * 0.2, 0.0003, RAIN_LIFE_MS);
    }
  }

  /** Bursts upward from one point. */
  burst(x: number, y: number, count: number): void {
    for (let index = 0; index < count; index++) {
      this.add(x, y, (Math.random() - 0.5) * 0.8, -0.2 - Math.random() * 0.45, 0.0012, BURST_LIFE_MS);
    }
  }

  private add(x: number, y: number, vx: number, vy: number, gravity: number, life: number): void {
    if (reducedMotion()) {
      return;
    }

    const size = 10 + Math.random() * 8;
    const piece = new Graphics().rect(-size / 2, -size / 2, size, size).fill(COLORS[this.thrown++ % COLORS.length]);

    piece.position.set(x, y);
    this.addChild(piece);
    this.particles.push({ piece, vx, vy, gravity, spin: (Math.random() - 0.5) * 0.01, age: 0, life });
  }

  private update(ticker: Ticker): void {
    const { deltaMS } = ticker;

    for (let index = this.particles.length - 1; index >= 0; index--) {
      const particle = this.particles[index];

      particle.age += deltaMS;
      particle.vy += particle.gravity * deltaMS;
      particle.piece.x += particle.vx * deltaMS;
      particle.piece.y += particle.vy * deltaMS;
      particle.piece.rotation += particle.spin * deltaMS;
      particle.piece.alpha = Math.min(1, 2 * (1 - particle.age / particle.life));

      if (particle.age >= particle.life) {
        particle.piece.destroy();
        this.particles.splice(index, 1);
      }
    }
  }
}
