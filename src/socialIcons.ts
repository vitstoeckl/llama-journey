import { Graphics } from 'pixi.js';

const INSTAGRAM_PINK = 0xd62976;
const LINKEDIN_BLUE = 0x0a66c2;
const WHATSAPP_GREEN = 0x25d366;
const WHITE = 0xffffff;

/** The Instagram camera on a rounded square, centred on its origin. */
export function createInstagramIcon(size: number): Graphics {
  const half = size / 2;

  return new Graphics()
    .roundRect(-half, -half, size, size, size * 0.24)
    .fill(INSTAGRAM_PINK)
    .roundRect(-size * 0.3, -size * 0.3, size * 0.6, size * 0.6, size * 0.16)
    .stroke({ width: size * 0.07, color: WHITE })
    .circle(0, 0, size * 0.13)
    .stroke({ width: size * 0.07, color: WHITE })
    .circle(size * 0.17, -size * 0.17, size * 0.04)
    .fill(WHITE);
}

/** The LinkedIn "in" on a rounded square, centred on its origin. */
export function createLinkedInIcon(size: number): Graphics {
  const half = size / 2;
  const stem = size * 0.12;
  const top = -size * 0.1;
  const bottom = size * 0.32;
  const iLeft = -size * 0.3;
  const nLeft = -size * 0.08;
  const nRight = size * 0.2;

  return new Graphics()
    .roundRect(-half, -half, size, size, size * 0.14)
    .fill(LINKEDIN_BLUE)
    .circle(iLeft + stem / 2, -size * 0.25, stem * 0.65)
    .fill(WHITE)
    .rect(iLeft, top, stem, bottom - top)
    .fill(WHITE)
    .rect(nLeft, top, stem, bottom - top)
    .fill(WHITE)
    .rect(nRight, top + size * 0.1, stem, bottom - top - size * 0.1)
    .fill(WHITE)
    .roundRect(nLeft, top, nRight + stem - nLeft, size * 0.17, size * 0.08)
    .fill(WHITE);
}

/** The WhatsApp speech bubble and handset on a rounded square, centred on its origin. */
export function createWhatsAppIcon(size: number): Graphics {
  const half = size / 2;
  const ring = size * 0.3;
  const line = size * 0.07;
  // The handset: a curved grip from the earpiece (upper left) to the mouthpiece (lower right),
  // bowing towards the lower left, with a rounded pad at each end.
  const bend = ring * 0.5;
  const centreX = ring * 0.18;
  const centreY = -ring * 0.18;
  const long = size * 0.15;
  const short = size * 0.09;
  const earX = centreX - bend;
  const earY = centreY - size * 0.02;
  const mouthX = centreX + size * 0.02;
  const mouthY = centreY + bend;

  return new Graphics()
    .roundRect(-half, -half, size, size, size * 0.24)
    .fill(WHATSAPP_GREEN)
    .circle(0, 0, ring)
    .stroke({ width: line, color: WHITE })
    .poly([-ring * 0.95, ring * 0.35, -ring * 1.2, ring * 1.2, -ring * 0.3, ring * 0.95])
    .fill(WHITE)
    .arc(centreX, centreY, bend, Math.PI * 0.55, Math.PI * 0.95)
    .stroke({ width: size * 0.06, color: WHITE })
    // Each pad lies across the grip's end: upright on the left, flat at the bottom.
    .roundRect(earX - short / 2, earY - long / 2, short, long, size * 0.04)
    .fill(WHITE)
    .roundRect(mouthX - long / 2, mouthY - short / 2, long, short, size * 0.04)
    .fill(WHITE);
}
