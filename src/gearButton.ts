import { Circle, Container, Graphics } from 'pixi.js';
import { ALPACA, INDIGO } from './theme';
import { weave } from './woven';

const TILE_WIDTH = 52;
const TILE_HEIGHT = 44;
const ICON_CELL = 4;
const HIT_RADIUS = 44;

const GEAR = [
  '....X....',
  '.X.XXX.X.',
  '..XXXXX..',
  '.XXX.XXX.',
  'XXX...XXX',
  '.XXX.XXX.',
  '..XXXXX..',
  '.X.XXX.X.',
  '....X....',
];

const HOUSE = [
  '....X....',
  '...XXX...',
  '..XXXXX..',
  '.XXXXXXX.',
  'XXXXXXXXX',
  '.XXXXXXX.',
  '.XXX.XXX.',
  '.XXX.XXX.',
  '.XXX.XXX.',
];

/** A gear on the same tile as the sound button, centred on its origin. It opens the settings. */
export function createGearButton(onTap: () => void): Container {
  return createIconButton(GEAR, onTap);
}

/** A house on the same tile, centred on its origin. It goes back to the home page. */
export function createHomeButton(onTap: () => void): Container {
  return createIconButton(HOUSE, onTap);
}

function createIconButton(icon: readonly string[], onTap: () => void): Container {
  const button = new Container();
  const size = icon.length * ICON_CELL;

  button.addChild(
    new Graphics().rect(-TILE_WIDTH / 2, -TILE_HEIGHT / 2, TILE_WIDTH, TILE_HEIGHT).fill(INDIGO),
    weave(new Graphics(), icon, { X: ALPACA }, -size / 2, -size / 2, ICON_CELL),
  );
  button.eventMode = 'static';
  button.cursor = 'pointer';
  button.hitArea = new Circle(0, 0, HIT_RADIUS);
  // Kept from screens that react to a tap anywhere, such as the journey.
  button.on('pointertap', (event) => {
    event.stopPropagation();
    onTap();
  });

  return button;
}
