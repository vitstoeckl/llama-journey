import type { Container } from 'pixi.js';
import { createButton } from './button';
import { createFlag } from './flags';
import { createGearButton } from './gearButton';
import { t } from './i18n';
import { DESIGN_WIDTH } from './layout';
import { createLogo } from './logo';
import { startQuiz } from './QuestionScreen';
import { COUNTRIES, type Country } from './questions';
import { STOPS } from './routeMap';
import type { ScreenManager } from './screens';
import { SettingsScreen } from './SettingsScreen';
import { showSidePanels } from './sidePanels';
import { createSoundButton } from './soundButton';
import { createText } from './text';
import { ALPACA, CELL, CONTENT_WIDTH, INDIGO, MAIZE } from './theme';
import { WovenScreen } from './WovenScreen';

const LEFT = (DESIGN_WIDTH - CONTENT_WIDTH) / 2;
const LOGO_TOP = 62;
const CORNER_X = 658;
const GEAR_Y = 90;
const SOUND_Y = 150;
const INTRO_GAP = 28;
const PROMPT_Y = 850;
const PROMPT_GAP = 40;
const BUTTONS_TOP = 888;
const BUTTON_HEIGHT = 8 * CELL;
const BUTTON_GAP = CELL;
/** From the button's left edge to the middle of its flag. */
const FLAG_INSET = 46;

/**
 * The first screen: the logo, what the game is, and a button for each country, which starts a
 * game about that country. The gear in the corner opens the language settings.
 */
export class HomeScreen extends WovenScreen {
  constructor(screens: ScreenManager) {
    super();
    showSidePanels(true);

    const text = t();
    const logo = createLogo();

    logo.position.set(LEFT, LOGO_TOP);

    const introTop = LOGO_TOP + logo.height + INTRO_GAP;
    const intro = createText({
      text: text.intro,
      size: 32,
      fill: ALPACA,
      maxWidth: CONTENT_WIDTH,
      maxHeight: PROMPT_Y - PROMPT_GAP - introTop,
      align: 'left',
      bold: false,
    });

    intro.position.set(LEFT, introTop);

    const prompt = createText({ text: text.chooseCountry, size: 40, fill: MAIZE, maxWidth: CONTENT_WIDTH });

    prompt.anchor.set(0.5);
    prompt.position.set(DESIGN_WIDTH / 2, PROMPT_Y);

    const gear = createGearButton(() => screens.show(new SettingsScreen(screens, () => new HomeScreen(screens))));
    const sound = createSoundButton();

    gear.position.set(CORNER_X, GEAR_Y);
    sound.position.set(CORNER_X, SOUND_Y);
    this.addChild(logo, intro, prompt, gear, sound);

    COUNTRIES.forEach((country, index) => {
      const button = createCountryButton(country, () => startQuiz(screens, country));

      button.position.set(
        DESIGN_WIDTH / 2,
        BUTTONS_TOP + BUTTON_HEIGHT / 2 + index * (BUTTON_HEIGHT + BUTTON_GAP),
      );
      this.addChild(button);
    });
  }

  /** The QR code and the cuy beside the game belong to the home page only. */
  override destroy(options?: Parameters<WovenScreen['destroy']>[0]): void {
    showSidePanels(false);
    super.destroy(options);
  }
}

/** The country's name, with its flag on the left. */
function createCountryButton(country: Country, onTap: () => void): Container {
  const flag = createFlag(STOPS[COUNTRIES.indexOf(country) + 1].flag);

  flag.x = -CONTENT_WIDTH / 2 + FLAG_INSET;

  return createButton({
    width: CONTENT_WIDTH,
    height: BUTTON_HEIGHT,
    fill: ALPACA,
    label: createText({ text: t().countries[country], size: 44, fill: INDIGO, maxWidth: CONTENT_WIDTH - 160 }),
    marker: flag,
    onTap,
  });
}
