import { Container, Graphics, Rectangle, Ticker, type DestroyOptions, type Text } from 'pixi.js';
import { createButton } from './button';
import { Confetti } from './confetti';
import { ART_COLORS, COUNTRY_LANDMARKS, COUNTRY_THINGS, THINGS_PER_COUNTRY } from './countryArt';
import { createGearButton } from './gearButton';
import { t } from './i18n';
import { DESIGN_WIDTH } from './layout';
import { createLlama, createRoute, LLAMA, ROUTE_HEIGHT, ROUTE_STOPS } from './logo';
import { clamp01, easeInOut, popScale, reducedMotion } from './motion';
import { COUNTRIES, type Country } from './questions';
import { addStopFlags, addTrail, flagPoint, flightPoint, STOPS, TRAIL_DOTS } from './routeMap';
import type { ScreenManager } from './screens';
import { SettingsScreen } from './SettingsScreen';
import { playFlight, playSound } from './sound';
import { createText } from './text';
import { ALPACA, CELL, CHILCA, CONTENT_WIDTH, INDIGO, MADDER, MAIZE } from './theme';
import { weave } from './woven';
import { WovenScreen } from './WovenScreen';
import { drawWorldMap } from './worldMap';

const HEADING_Y = 112;
const GEAR_X = 658;
const GEAR_Y = 90;
const CITY_Y = 186;
const COUNTRY_Y = 262;
const PANEL_TOP = 310;
const PANEL_HEIGHT = 540;
const GROUND_HEIGHT = 6 * CELL;
const GROUND_TOP = PANEL_HEIGHT - GROUND_HEIGHT;
const ROUTE_TOP = 920;
const STOP_LABEL_Y = ROUTE_TOP + ROUTE_HEIGHT + 6;
const CONTINUE_Y = 1130;
const THINGS_TOP = 866;
const THING_TILE_HEIGHT = 104;
const THING_TILE_WIDTH = 124;
const THING_LABEL_WIDTH = 132;
// Wider than the content, because five tiles and their labels do not fit in it.
const THINGS_WIDTH = 684;
const THING_CELL = 7;
const LANDMARK_NAME_Y = 44;
const LANDMARK_X = 500;

// On the map: wait, fly, settle on the flag, then zoom in on it.
const MAP_HOLD_MS = 500;
const FLIGHT_MS = 2600;
const LANDING_MS = 500;
const ZOOM_MS = 600;
const MAP_END_MS = MAP_HOLD_MS + FLIGHT_MS + LANDING_MS + ZOOM_MS;
const ZOOM = 3;

// In the country: fade in, the llama lands, the landmark rises, and its things pop up in turn.
const FADE_MS = 300;
const DESCENT_MS = 700;
const RISE_START_MS = 200;
const RISE_MS = 1100;
const CELEBRATE_START_MS = 1200;
const CELEBRATE_MS = 1500;
const THING_START_MS = 1500;
const THING_GAP_MS = 300;
const POP_MS = 350;
const CONTINUE_AT_MS = THING_START_MS + (THINGS_PER_COUNTRY - 1) * THING_GAP_MS + POP_MS;
const SHOWCASE_END_MS = Math.max(CONTINUE_AT_MS, CELEBRATE_START_MS + CELEBRATE_MS);

const FLAP_MS = 110;
const FLYER_CELL = 4;
const LLAMA_CELL = 8;
const LLAMA_X = 90;
const LLAMA_HEIGHT = LLAMA.length * LLAMA_CELL;
const HOP = 70;
const DESCENT_FROM = 360;
const MAX_TILT = 0.5;
const MINI_LLAMA_CELL = 2;
const MINI_LLAMA_WIDTH = LLAMA[0].length * MINI_LLAMA_CELL;

const WING_UP = ['.YY......', 'YYYYY....', '.YYYYYY..', '..YYYYYYY'];
const WING_DOWN = ['..YYYYYYY', '.YYYYYY..', 'YYYYY....', '.YY......'];
const WING_COLUMN = 6;
const WING_TOP_ROW = 7;
const WING_BOTTOM_ROW = 11;

const FAR_HILLS = 0x2b3573;
const CONFETTI_PIECES = 60;

const GROUND = [
  'GGGGGGGGGGGG',
  'GGGGGGGGGGGG',
  'YYYYYYYYYYYY',
  'MMYMMMMMYMMM',
  'MYYYMMMYYYMM',
  'MMYMMMMMYMMM',
];
const SUN = ['..XXX..', '.XXXXX.', 'XXXXXXX', 'XXXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..'];
const CLOUD = ['...XXX....', '.XXXXXXX..', 'XXXXXXXXXX'];

/** A llama with gold wings on its back, which flap until `folded` is set. */
function createWingedLlama(cell: number): { body: Container; flap: (elapsed: number, folded: boolean) => void } {
  const body = new Container();
  const wingUp = weave(new Graphics(), WING_UP, ART_COLORS, WING_COLUMN * cell, WING_TOP_ROW * cell, cell);
  const wingDown = weave(new Graphics(), WING_DOWN, ART_COLORS, WING_COLUMN * cell, WING_BOTTOM_ROW * cell, cell);

  body.addChild(createLlama(cell), wingUp, wingDown);

  return {
    body,
    flap(elapsed, folded) {
      const up = Math.floor(elapsed / FLAP_MS) % 2 === 0;

      wingUp.visible = !folded && up;
      wingDown.visible = !folded && !up;
    },
  };
}

/**
 * The trip to a country. The llama flies over a world map marked with flags to the next stop,
 * then the screen zooms in on the country: its landmark rises and five things it is known for appear.
 */
export class TravelScreen extends WovenScreen {
  private readonly stage = new Container();
  private readonly mapView = new Container();
  private readonly showcase = new Container();
  private readonly routeArea = new Container();
  private readonly nextStop: Text;
  private readonly arrived: Text;
  private readonly cityName: Text;
  private readonly landmarkName: Text;
  private readonly landmark: Graphics;
  private readonly landmarkHeight: number;
  private readonly destinationFlag: Graphics;
  private readonly flyer: ReturnType<typeof createWingedLlama>;
  private readonly lander: ReturnType<typeof createWingedLlama>;
  private readonly miniLlama: Graphics;
  private readonly routeBefore: Container;
  private readonly routeAfter: Container;
  private readonly trail: Graphics[] = [];
  private readonly things: Container[] = [];
  private readonly continueButton: Container;
  private readonly confetti = new Confetti();
  private readonly destination: number;
  private readonly fromX: number;
  private readonly toX: number;
  private readonly calm = reducedMotion();
  private elapsed = 0;
  /** When the zoomed-in part began, or null while still on the map. */
  private showcaseStart: number | null = null;
  private confettiThrown = false;
  private stopFlightSound: (() => void) | null = null;

  constructor(screens: ScreenManager, country: Country, onContinue: () => void) {
    super();

    const text = t();
    const words = text.showcase[country];
    const left = (DESIGN_WIDTH - CONTENT_WIDTH) / 2;

    this.destination = COUNTRIES.indexOf(country) + 1;
    this.nextStop = createText({ text: text.nextStop, size: 36, fill: ALPACA, maxWidth: CONTENT_WIDTH });
    this.arrived = createText({ text: text.arrived, size: 36, fill: ALPACA, maxWidth: CONTENT_WIDTH });
    this.arrived.visible = false;
    this.cityName = createText({
      text: text.cities[STOPS[this.destination].city],
      size: 76,
      fill: MAIZE,
      maxWidth: CONTENT_WIDTH,
    });

    const countryName = createText({ text: text.countries[country], size: 34, fill: ALPACA, maxWidth: CONTENT_WIDTH });

    for (const [label, y] of [
      [this.nextStop, HEADING_Y],
      [this.arrived, HEADING_Y],
      [this.cityName, CITY_Y],
      [countryName, COUNTRY_Y],
    ] as const) {
      label.anchor.set(0.5);
      label.position.set(DESIGN_WIDTH / 2, y);
    }

    this.addChild(this.nextStop, this.arrived, this.cityName, countryName);

    // Everything in the panel is cut off at its edges, so the zoom stays inside it.
    const mask = new Graphics().rect(0, 0, DESIGN_WIDTH, PANEL_HEIGHT).fill(0xffffff);

    this.stage.position.set(0, PANEL_TOP);
    this.stage.addChild(mask);
    this.stage.mask = mask;

    this.mapView.addChild(drawWorldMap(new Graphics(), PANEL_HEIGHT));
    this.drawTrails();
    this.destinationFlag = addStopFlags(this.mapView)[this.destination];
    this.flyer = createWingedLlama(FLYER_CELL);
    this.flyer.body.pivot.set((LLAMA[0].length * FLYER_CELL) / 2, (LLAMA.length * FLYER_CELL) / 2);
    this.mapView.addChild(this.flyer.body);

    // The country, hidden behind the map until the zoom ends.
    const { rows, cell } = COUNTRY_LANDMARKS[country];

    this.landmarkHeight = rows.length * cell;
    this.landmark = weave(new Graphics(), rows, ART_COLORS, LANDMARK_X - (rows[0].length * cell) / 2, 0, cell);
    this.lander = createWingedLlama(LLAMA_CELL);
    this.lander.body.x = LLAMA_X;
    this.landmarkName = createText({ text: words.landmark, size: 40, fill: MAIZE, maxWidth: CONTENT_WIDTH });
    this.landmarkName.anchor.set(0.5);
    this.landmarkName.position.set(DESIGN_WIDTH / 2, LANDMARK_NAME_Y);
    this.drawShowcase();
    this.showcase.visible = false;

    this.stage.addChild(this.mapView, this.showcase, this.confetti);
    this.addChild(this.stage);

    // The whole route below the map, with a tiny llama moving along it from Lima.
    this.routeBefore = createRoute([0]);
    this.routeAfter = createRoute([0, this.destination]);
    this.routeAfter.visible = false;
    this.fromX = left + ROUTE_STOPS[0] - MINI_LLAMA_WIDTH / 2;
    this.toX = left + ROUTE_STOPS[this.destination] - MINI_LLAMA_WIDTH / 2;
    this.miniLlama = createLlama(MINI_LLAMA_CELL);
    this.miniLlama.y = ROUTE_TOP - LLAMA.length * MINI_LLAMA_CELL;

    for (const route of [this.routeBefore, this.routeAfter]) {
      route.position.set(left, ROUTE_TOP);
    }

    this.routeArea.addChild(this.routeBefore, this.routeAfter, this.miniLlama);

    STOPS.forEach(({ city }, stop) => {
      const label = createText({
        text: text.cities[city],
        size: 30,
        fill: stop === this.destination ? MAIZE : ALPACA,
        maxWidth: 12 * CELL - 8,
      });

      label.anchor.set(0.5, 0);
      label.position.set(left + ROUTE_STOPS[stop], STOP_LABEL_Y);
      this.routeArea.addChild(label);
    });

    this.addChild(this.routeArea);
    this.drawThings(country, words.things);

    this.continueButton = createButton({
      width: CONTENT_WIDTH,
      height: 8 * CELL,
      fill: MAIZE,
      label: createText({ text: text.continueJourney, size: 42, fill: INDIGO, maxWidth: CONTENT_WIDTH - 64 }),
      onTap: onContinue,
    });
    this.continueButton.position.set(DESIGN_WIDTH / 2, CONTINUE_Y);
    this.continueButton.visible = false;
    this.addChild(this.continueButton);

    // The gear starts the trip again in the new language.
    const gear = createGearButton(() =>
      screens.show(new SettingsScreen(screens, () => new TravelScreen(screens, country, onContinue))),
    );

    gear.position.set(GEAR_X, GEAR_Y);
    this.addChild(gear);

    // A tap anywhere skips ahead: first past the flight, then to the end of the country's part.
    this.eventMode = 'static';
    this.hitArea = new Rectangle(-2000, -2000, 5000, 5000);
    this.on('pointertap', () => this.skip());

    this.placeOnMap(0);

    if (this.calm) {
      this.skip();
      this.skip();
    }

    Ticker.shared.add(this.update, this);
  }

  override destroy(options?: DestroyOptions): void {
    this.stopFlightSound?.();
    Ticker.shared.remove(this.update, this);
    super.destroy(options);
  }

  /** The dotted arc from Lima, which appears as the llama flies it. */
  private drawTrails(): void {
    this.trail.push(...addTrail(this.mapView, this.destination));
  }

  private drawShowcase(): void {
    const sky = new Graphics().rect(0, 0, DESIGN_WIDTH, PANEL_HEIGHT).fill(INDIGO);
    const sun = weave(new Graphics(), SUN, { X: MAIZE }, 600, 90, 10);
    const scenery = new Container();

    for (let x = -60, index = 0; x < DESIGN_WIDTH + 200; x += 210, index++) {
      const height = 10 + (index * 7) % 6;
      const hill = Array.from({ length: height }, (_, row) => {
        const side = '.'.repeat(height - 1 - row);

        return side + 'X'.repeat(2 * row + 1) + side;
      });

      scenery.addChild(
        weave(new Graphics(), hill, { X: FAR_HILLS }, x - hill[0].length * 7, GROUND_TOP - hill.length * 14, 14),
      );
    }

    for (const [x, y] of [[60, 110], [340, 90], [120, 190]]) {
      scenery.addChild(weave(new Graphics(), CLOUD, { X: ALPACA }, x, y, 10));
    }

    const ground = weave(new Graphics(), GROUND.map((row) => row.repeat(6)), { G: CHILCA, Y: MAIZE, M: MADDER });

    ground.y = GROUND_TOP;
    this.showcase.addChild(sky, sun, scenery, this.landmark, ground, this.lander.body, this.landmarkName);
  }

  /** A row of five tiles below the panel, one for each thing the country is known for. */
  private drawThings(country: Country, names: readonly string[]): void {
    const left = (DESIGN_WIDTH - THINGS_WIDTH) / 2;
    const column = THINGS_WIDTH / names.length;

    COUNTRY_THINGS[country].forEach((icon, index) => {
      const thing = new Container();
      const tile = new Graphics()
        .rect(-THING_TILE_WIDTH / 2, -THING_TILE_HEIGHT / 2, THING_TILE_WIDTH, THING_TILE_HEIGHT)
        .fill(INDIGO);
      const drawn = weave(
        new Graphics(),
        icon,
        ART_COLORS,
        (-icon[0].length * THING_CELL) / 2,
        (-icon.length * THING_CELL) / 2,
        THING_CELL,
      );
      const label = createText({
        text: names[index],
        size: 24,
        fill: ALPACA,
        maxWidth: THING_LABEL_WIDTH,
        maxHeight: 76,
      });

      label.anchor.set(0.5, 0);
      label.y = THING_TILE_HEIGHT / 2 + 8;
      thing.addChild(tile, drawn, label);
      thing.position.set(left + (index + 0.5) * column, THINGS_TOP + THING_TILE_HEIGHT / 2);
      thing.scale.set(0);
      thing.visible = false;
      this.addChild(thing);
      this.things.push(thing);
    });
  }

  private skip(): void {
    if (this.showcaseStart === null) {
      this.startShowcase();
    } else {
      this.showcaseStart = this.elapsed - SHOWCASE_END_MS;
      this.placeInCountry(SHOWCASE_END_MS);
    }
  }

  private startShowcase(): void {
    this.stopFlightSound?.();
    this.showcaseStart = this.elapsed;
    this.nextStop.visible = false;
    this.arrived.visible = true;
    this.routeArea.visible = false;
    this.showcase.visible = true;

    for (const thing of this.things) {
      thing.visible = true;
    }

    this.placeInCountry(0);
  }

  private update(ticker: Ticker): void {
    this.elapsed += ticker.deltaMS;

    if (this.showcaseStart !== null) {
      this.placeInCountry(this.elapsed - this.showcaseStart);
    } else if (this.elapsed >= MAP_END_MS) {
      this.startShowcase();
    } else {
      this.placeOnMap(this.elapsed);
    }
  }

  private placeOnMap(time: number): void {
    if (time >= MAP_HOLD_MS && !this.stopFlightSound) {
      this.stopFlightSound = playFlight(FLIGHT_MS / 1000);
    }

    const flight = easeInOut(clamp01((time - MAP_HOLD_MS) / FLIGHT_MS));
    const landed = clamp01((time - MAP_HOLD_MS - FLIGHT_MS) / LANDING_MS);
    const zoom = easeInOut(clamp01((time - MAP_HOLD_MS - FLIGHT_MS - LANDING_MS) / ZOOM_MS));
    const point = flightPoint(this.destination, flight);
    const ahead = flightPoint(this.destination, Math.min(1, flight + 0.02));
    const flying = flight > 0 && flight < 1;
    const heading = Math.atan2(ahead.y - point.y, ahead.x - point.x);

    this.flyer.body.position.set(point.x, point.y);
    this.flyer.body.scale.set(0.65 + 0.45 * Math.sin(Math.PI * flight));
    this.flyer.body.rotation = flying ? Math.max(-MAX_TILT, Math.min(MAX_TILT, heading)) : 0;
    this.flyer.flap(time, !flying);
    this.trail.forEach((dot, index) => {
      dot.visible = index / TRAIL_DOTS < flight;
    });

    this.destinationFlag.scale.set(
      landed > 0 ? 1 + 0.5 * Math.sin(Math.PI * landed) : 1 + 0.12 * Math.sin(time / 180),
    );
    this.miniLlama.x = this.fromX + (this.toX - this.fromX) * flight;
    this.routeBefore.visible = landed === 0;
    this.routeAfter.visible = landed > 0;

    const target = flagPoint(this.destination);

    this.mapView.scale.set(1 + (ZOOM - 1) * zoom);
    this.mapView.position.set(
      (DESIGN_WIDTH / 2 - target.x * ZOOM) * zoom,
      (PANEL_HEIGHT / 2 - target.y * ZOOM) * zoom,
    );
  }

  private placeInCountry(time: number): void {
    const descent = easeInOut(clamp01(time / DESCENT_MS));
    const rise = easeInOut(clamp01((time - RISE_START_MS) / RISE_MS));
    const celebration = clamp01((time - CELEBRATE_START_MS) / CELEBRATE_MS);
    const hop = Math.abs(Math.sin(celebration * Math.PI * 3)) * (1 - celebration);

    this.showcase.alpha = clamp01(time / FADE_MS);
    this.mapView.visible = this.showcase.alpha < 1;
    this.lander.body.y = GROUND_TOP - LLAMA_HEIGHT - (1 - descent) * DESCENT_FROM - hop * HOP;
    this.lander.flap(time, descent >= 1);
    this.landmark.y = GROUND_TOP - this.landmarkHeight * rise;
    this.landmarkName.alpha = clamp01((time - RISE_START_MS - RISE_MS) / FADE_MS + 1);
    this.cityName.scale.set(1 + Math.sin(clamp01(celebration * 3) * Math.PI) * 0.25);

    this.things.forEach((thing, index) => {
      const pop = (time - THING_START_MS - index * THING_GAP_MS) / POP_MS;

      thing.scale.set(pop <= 0 ? 0 : popScale(pop));
    });
    this.continueButton.visible = time >= CONTINUE_AT_MS;

    if (time >= CELEBRATE_START_MS && !this.confettiThrown) {
      this.confettiThrown = true;
      this.confetti.rain(CONFETTI_PIECES, DESIGN_WIDTH);
      playSound('arrive');
    }
  }
}
