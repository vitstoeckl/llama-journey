import { Container, Graphics } from 'pixi.js';
import { createButton } from './button';
import { createFlag } from './flags';
import { createHomeButton } from './gearButton';
import { HomeScreen } from './HomeScreen';
import { getLanguage, LANGUAGES, languageName, setLanguage, t, type Language } from './i18n';
import { DESIGN_WIDTH } from './layout';
import type { Screen, ScreenManager } from './screens';
import { createSoundButton } from './soundButton';
import { createText } from './text';
import { ALPACA, CELL, CONTENT_WIDTH, INDIGO, MAIZE } from './theme';
import { weave } from './woven';
import { WovenScreen } from './WovenScreen';

const TITLE_Y = 170;
const BUTTONS_TOP = 250;
const BUTTON_HEIGHT = 8 * CELL;
const BUTTON_GAP = CELL;
const BACK_Y = 1130;
// Sound and home in the top-right corner, where the gear sits on the other screens.
const CORNER_X = 658;
const SOUND_Y = 90;
const HOME_Y = 150;
const MARKER = ['..X..', '.XXX.', 'XXXXX', '.XXX.', '..X..'];
const MARKER_CELL = 6;
/** From the button's left edge to the middle of its flag. */
const FLAG_INSET = 46;

/**
 * Opened by the gear on any screen: a choice of five languages, each labelled in its own language.
 * The choice lasts until the game is closed. `back` rebuilds the screen the gear was on, so the game
 * carries on where it was, in the new language.
 */
export class SettingsScreen extends WovenScreen {
  constructor(screens: ScreenManager, back: () => Screen = () => new HomeScreen(screens)) {
    super();

    const text = t();
    const title = createText({ text: text.chooseLanguage, size: 48, fill: MAIZE, maxWidth: CONTENT_WIDTH });

    title.anchor.set(0.5);
    title.position.set(DESIGN_WIDTH / 2, TITLE_Y);
    this.addChild(title);

    LANGUAGES.forEach((language, index) => {
      const button = createLanguageButton(language, () => {
        setLanguage(language);
        screens.show(back());
      });

      button.position.set(
        DESIGN_WIDTH / 2,
        BUTTONS_TOP + BUTTON_HEIGHT / 2 + index * (BUTTON_HEIGHT + BUTTON_GAP),
      );
      this.addChild(button);
    });

    const backButton = createButton({
      width: CONTENT_WIDTH,
      height: 7 * CELL,
      fill: MAIZE,
      label: createText({ text: text.back, size: 40, fill: INDIGO, maxWidth: CONTENT_WIDTH - 64 }),
      onTap: () => screens.show(back()),
    });

    backButton.position.set(DESIGN_WIDTH / 2, BACK_Y);

    const sound = createSoundButton();
    const home = createHomeButton(() => screens.show(new HomeScreen(screens)));

    sound.position.set(CORNER_X, SOUND_Y);
    home.position.set(CORNER_X, HOME_Y);
    this.addChild(backButton, sound, home);
  }
}

/** A button labelled in its own language. The current language is gold, with a diamond. */
function createLanguageButton(language: Language, onTap: () => void): Container {
  const selected = language === getLanguage();

  return createButton({
    width: CONTENT_WIDTH,
    height: BUTTON_HEIGHT,
    fill: selected ? MAIZE : ALPACA,
    label: createText({
      text: languageName(language),
      size: 44,
      fill: INDIGO,
      maxWidth: CONTENT_WIDTH - 160,
      language,
    }),
    marker: createButtonMarks(language, selected),
    onTap,
  });
}

/** The language's flag on the left and, for the current language, a diamond on the right. */
function createButtonMarks(language: Language, selected: boolean): Container {
  const marks = new Container();
  const flag = createFlag(language);

  flag.x = -CONTENT_WIDTH / 2 + FLAG_INSET;
  marks.addChild(flag);

  if (selected) {
    const size = MARKER.length * MARKER_CELL;

    marks.addChild(
      weave(new Graphics(), MARKER, { X: INDIGO }, CONTENT_WIDTH / 2 - 36 - size, -size / 2, MARKER_CELL),
    );
  }

  return marks;
}
