import { Graphics, type Container } from 'pixi.js';
import { createFlag } from './flags';
import type { Language } from './i18n';
import { ALPACA, MAIZE } from './theme';
import { mapPoint } from './worldMap';

export const TRAIL_DOTS = 36;
const TRAIL_DOT = 5;

/**
 * The route's stops. Spanish flies Peru's flag on the language buttons, so `flag` also picks
 * that flag here. Prague and Berlin are almost one point on a world map, so their flags
 * lean apart, and each flag is where the llama lands.
 */
export const STOPS: {
  city: 'lima' | 'prague' | 'berlin' | 'tokyo';
  flag: Language;
  longitude: number;
  latitude: number;
  flagX: number;
  flagY: number;
}[] = [
  { city: 'lima', flag: 'es', longitude: -77.04, latitude: -12.05, flagX: -36, flagY: -44 },
  { city: 'prague', flag: 'cs', longitude: 14.44, latitude: 50.08, flagX: 42, flagY: -36 },
  { city: 'berlin', flag: 'de', longitude: 13.4, latitude: 52.52, flagX: -42, flagY: -44 },
  { city: 'tokyo', flag: 'ja', longitude: 139.69, latitude: 35.68, flagX: 8, flagY: -48 },
];

interface Point {
  x: number;
  y: number;
}

export function flagPoint(stop: number): Point {
  const { longitude, latitude, flagX, flagY } = STOPS[stop];
  const { x, y } = mapPoint(longitude, latitude);

  return { x: x + flagX, y: y + flagY };
}

/** A point on the arc of the flight from Lima to a stop, from 0 to 1. Every trip starts in Lima. */
export function flightPoint(toStop: number, progress: number): Point {
  const from = flagPoint(0);
  const to = flagPoint(toStop);
  const lift = 80 + Math.hypot(to.x - from.x, to.y - from.y) * 0.25;
  const control = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 - lift };
  const rest = 1 - progress;

  return {
    x: rest * rest * from.x + 2 * rest * progress * control.x + progress * progress * to.x,
    y: rest * rest * from.y + 2 * rest * progress * control.y + progress * progress * to.y,
  };
}

/** Adds the dotted arc of the flight from Lima to a stop, and returns its dots in flying order. */
export function addTrail(map: Container, toStop: number): Graphics[] {
  return Array.from({ length: TRAIL_DOTS }, (_, dot) => {
    const { x, y } = flightPoint(toStop, dot / TRAIL_DOTS);
    const piece = new Graphics().rect(-TRAIL_DOT / 2, -TRAIL_DOT / 2, TRAIL_DOT, TRAIL_DOT).fill(MAIZE);

    piece.position.set(x, y);
    map.addChild(piece);

    return piece;
  });
}

/** Adds a flag on a pole at each stop to the map, and returns the flags in route order. */
export function addStopFlags(map: Container): Graphics[] {
  return STOPS.map(({ flag: language, longitude, latitude }, stop) => {
    const base = mapPoint(longitude, latitude);
    const top = flagPoint(stop);
    const pole = new Graphics()
      .moveTo(base.x, base.y)
      .lineTo(top.x, top.y)
      .stroke({ width: 3, color: ALPACA })
      .circle(base.x, base.y, 5)
      .fill(MAIZE);
    const flag = createFlag(language);

    flag.position.set(top.x, top.y);
    map.addChild(pole, flag);

    return flag;
  });
}
