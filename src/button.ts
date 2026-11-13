import { Container, Graphics, type Text } from 'pixi.js';
import { MADDER } from './theme';

const STEP = 6;
const SHADOW_DEPTH = 8;

interface ButtonOptions {
  width: number;
  height: number;
  fill: number;
  label: Text;
  /** Drawn on the button's face, so it moves with the label when pressed. */
  marker?: Container;
  onTap: () => void;
}

/** A button with stepped corners, like a woven tab, that sinks into its shadow when pressed. */
export function createButton({ width, height, fill, label, marker, onTap }: ButtonOptions): Container {
  const button = new Container();
  const shadow = steppedRect(width, height, MADDER);
  const face = new Container();

  shadow.y = SHADOW_DEPTH;
  label.anchor.set(0.5);
  face.addChild(steppedRect(width, height, fill), label);

  if (marker) {
    face.addChild(marker);
  }

  button.addChild(shadow, face);

  const press = (down: boolean) => {
    face.y = down ? SHADOW_DEPTH : 0;
  };

  button.eventMode = 'static';
  button.cursor = 'pointer';
  button.on('pointerdown', () => press(true));
  button.on('pointerup', () => press(false));
  button.on('pointerupoutside', () => press(false));
  button.on('pointerleave', () => press(false));
  button.on('pointertap', onTap);

  return button;
}

/** A rectangle centred on the origin, with each corner cut in two steps. */
function steppedRect(width: number, height: number, fill: number): Graphics {
  const x = width / 2;
  const y = height / 2;
  const s = STEP;

  return new Graphics()
    .poly([
      -x + 2 * s, -y,
      x - 2 * s, -y,
      x - 2 * s, -y + s,
      x - s, -y + s,
      x - s, -y + 2 * s,
      x, -y + 2 * s,
      x, y - 2 * s,
      x - s, y - 2 * s,
      x - s, y - s,
      x - 2 * s, y - s,
      x - 2 * s, y,
      -x + 2 * s, y,
      -x + 2 * s, y - s,
      -x + s, y - s,
      -x + s, y - 2 * s,
      -x, y - 2 * s,
      -x, -y + 2 * s,
      -x + s, -y + 2 * s,
      -x + s, -y + s,
      -x + 2 * s, -y + s,
    ])
    .fill(fill);
}
