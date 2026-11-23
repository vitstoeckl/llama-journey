import { Circle, Container, Graphics } from 'pixi.js';
import { soundIsOn, toggleSound } from './sound';
import { ALPACA, INDIGO, MAIZE } from './theme';
import { weave } from './woven';

const TILE_WIDTH = 52;
const TILE_HEIGHT = 44;
const ICON_CELL = 4;
const HIT_RADIUS = 44;

const SPEAKER_ON = [
  '...X.....',
  '..XX..X..',
  'XXXX...X.',
  'XXXX.X.X.',
  'XXXX.X.X.',
  'XXXX...X.',
  '..XX..X..',
  '...X.....',
];
const SPEAKER_OFF = [
  '...X.....',
  '..XX.....',
  'XXXX.X..X',
  'XXXX..XX.',
  'XXXX..XX.',
  'XXXX.X..X',
  '..XX.....',
  '...X.....',
];

/** A speaker that turns sound on and off, centred on its origin: gold with waves, or pale with a cross. */
export function createSoundButton(): Container {
  const button = new Container();
  const icon = new Graphics();
  const draw = () => {
    const rows = soundIsOn() ? SPEAKER_ON : SPEAKER_OFF;

    weave(
      icon.clear(),
      rows,
      { X: soundIsOn() ? MAIZE : ALPACA },
      (-rows[0].length * ICON_CELL) / 2,
      (-rows.length * ICON_CELL) / 2,
      ICON_CELL,
    );
  };

  button.addChild(new Graphics().rect(-TILE_WIDTH / 2, -TILE_HEIGHT / 2, TILE_WIDTH, TILE_HEIGHT).fill(INDIGO), icon);
  draw();

  button.eventMode = 'static';
  button.cursor = 'pointer';
  button.hitArea = new Circle(0, 0, HIT_RADIUS);
  button.on('pointertap', (event) => {
    // Kept from screens that react to a tap anywhere, such as the journey.
    event.stopPropagation();
    toggleSound();
    draw();
  });

  return button;
}
