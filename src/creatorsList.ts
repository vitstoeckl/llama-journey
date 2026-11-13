import { Assets, Circle, Container, Graphics, Sprite, type Texture } from 'pixi.js';
import { CREATORS, type Creator } from './creators';
import { DESIGN_WIDTH } from './layout';
import { createInstagramIcon, createLinkedInIcon, createWhatsAppIcon } from './socialIcons';
import { createText } from './text';
import { ALPACA, CONTENT_WIDTH, INDIGO } from './theme';

const LEFT = (DESIGN_WIDTH - CONTENT_WIDTH) / 2;
const ROW_GAP = 150;
const AVATAR_SIZE = 110;
const COLUMN_X = LEFT + AVATAR_SIZE + 24;
const COLUMN_WIDTH = CONTENT_WIDTH - AVATAR_SIZE - 24;
const NAME_OFFSET = -34;
const ICONS_OFFSET = 26;
const ICON_SIZE = 64;
const ICON_GAP = 16;
const FADED = 0.3;

/** A row for each creator: photo, name and profile links. `firstRowY` is the middle of the first row. */
export function createCreatorsList(firstRowY: number): Container {
  const list = new Container();

  CREATORS.forEach((creator, index) => {
    const y = firstRowY + index * ROW_GAP;
    const avatar = createAvatar(creator);
    const label = createText({
      text: creator.name,
      size: 36,
      fill: ALPACA,
      maxWidth: COLUMN_WIDTH,
      // One line only, so a long name shrinks instead of running into the icons.
      maxHeight: 50,
      align: 'left',
    });

    avatar.position.set(LEFT + AVATAR_SIZE / 2, y);
    label.anchor.set(0, 0.5);
    label.position.set(COLUMN_X, y + NAME_OFFSET);
    list.addChild(avatar, label);

    [
      linkIcon(createInstagramIcon(ICON_SIZE), creator.instagram),
      linkIcon(createLinkedInIcon(ICON_SIZE), creator.linkedin),
      linkIcon(createWhatsAppIcon(ICON_SIZE), creator.whatsapp),
    ].forEach((icon, column) => {
      icon.position.set(COLUMN_X + ICON_SIZE / 2 + column * (ICON_SIZE + ICON_GAP), y + ICONS_OFFSET);
      list.addChild(icon);
    });
  });

  return list;
}

/** A round photo. The person's initials show until it loads, or if there is none. */
function createAvatar({ name, photo }: Creator): Container {
  const avatar = new Container();
  const radius = AVATAR_SIZE / 2;
  // At most two letters, so a long name such as Paulo Augusto Arteaga Uribe still fits the circle.
  const initials = createText({
    text: name
      .split(' ')
      .slice(0, 2)
      .map((part) => part[0])
      .join(''),
    size: 40,
    fill: ALPACA,
    maxWidth: AVATAR_SIZE - 24,
  });

  initials.anchor.set(0.5);
  avatar.addChild(new Graphics().circle(0, 0, radius).fill(INDIGO), initials);

  if (photo) {
    void Assets.load<Texture>(`${import.meta.env.BASE_URL}creators/${photo}`)
      .then((texture) => {
        // The player may already have left this screen.
        if (avatar.destroyed) {
          return;
        }

        const picture = new Sprite(texture);
        const mask = new Graphics().circle(0, 0, radius).fill(0xffffff);

        picture.anchor.set(0.5);
        picture.scale.set(AVATAR_SIZE / Math.min(texture.width, texture.height));
        picture.mask = mask;
        avatar.addChild(mask, picture);
      })
      // A missing photo should never stop the game: the initials stay.
      .catch(() => {});
  }

  return avatar;
}

/** Opens the profile in a new tab when tapped. Without an address, the icon is faded and inert. */
function linkIcon(icon: Graphics, address: string | undefined): Graphics {
  if (!address) {
    icon.alpha = FADED;

    return icon;
  }

  icon.eventMode = 'static';
  icon.cursor = 'pointer';
  icon.hitArea = new Circle(0, 0, ICON_SIZE * 0.7);
  icon.on('pointertap', () => {
    window.open(address, '_blank', 'noopener');
  });

  return icon;
}
