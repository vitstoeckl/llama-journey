import { Container } from 'pixi.js';
import { createButton } from './button';
import { Confetti } from './confetti';
import { createCreatorsList } from './creatorsList';
import { createFlag } from './flags';
import { createGearButton, createHomeButton } from './gearButton';
import { t } from './i18n';
import { DESIGN_WIDTH } from './layout';
import { animate, popScale } from './motion';
import { HomeScreen } from './HomeScreen';
import { startQuiz } from './QuestionScreen';
import { COUNTRIES } from './questions';
import type { Quiz } from './quiz';
import { STOPS } from './routeMap';
import type { ScreenManager } from './screens';
import { SettingsScreen } from './SettingsScreen';
import { playSound } from './sound';
import { createSoundButton } from './soundButton';
import { createText } from './text';
import { ALPACA, CELL, CONTENT_WIDTH, INDIGO, MAIZE } from './theme';
import { WovenScreen } from './WovenScreen';

const TITLE_Y = 96;
const POINTS_Y = 176;
const SUMMARY_Y = 250;
const SUMMARY_MAX_HEIGHT = 56;
const COUNTRIES_Y = 310;
const COUNTRY_NAME_OFFSET = 46;
const COUNTRY_NAME_MAX_HEIGHT = 38;
const COUNTRY_SCORE_OFFSET = 92;
const CREATORS_TITLE_Y = 462;
const FIRST_CREATOR_Y = 552;
const PLAY_AGAIN_Y = 1130;
const GEAR_X = 658;
// Settings, sound and home are stacked in the top-right corner, as on the home page.
const GEAR_Y = 72;
const SOUND_Y = 130;
const HOME_Y = 188;

const COUNT_UP_MS = 900;
const POP_MS = 350;
const POP_GAP_MS = 250;
const BASE_CONFETTI = 30;
const CONFETTI_PER_POINT = 6;

/** The end of a game: the points, the country's flag and score, who made the game, and ways to play on. */
export class ResultScreen extends WovenScreen {
  /** `quiet` leaves out the fanfare, for when the page is redrawn in another language. */
  constructor(screens: ScreenManager, quiz: Quiz, { quiet = false }: { quiet?: boolean } = {}) {
    super();

    const text = t();
    const points = createText({ text: text.score(quiz.score), size: 72, fill: ALPACA, maxWidth: CONTENT_WIDTH });
    const labels = [
      { y: TITLE_Y, label: createText({ text: text.resultTitle, size: 52, fill: MAIZE, maxWidth: CONTENT_WIDTH }) },
      { y: POINTS_Y, label: points },
      {
        y: SUMMARY_Y,
        label: createText({
          text: text.result(quiz.score, quiz.total),
          size: 32,
          fill: ALPACA,
          maxWidth: CONTENT_WIDTH,
          maxHeight: SUMMARY_MAX_HEIGHT,
          bold: false,
        }),
      },
      {
        y: CREATORS_TITLE_Y,
        label: createText({ text: text.creatorsTitle, size: 36, fill: MAIZE, maxWidth: CONTENT_WIDTH }),
      },
    ];

    for (const { y, label } of labels) {
      label.anchor.set(0.5);
      label.position.set(DESIGN_WIDTH / 2, y);
      this.addChild(label);
    }

    animate(this, COUNT_UP_MS, (progress) => {
      points.text = text.score(Math.round(quiz.score * progress));
    });

    const left = (DESIGN_WIDTH - CONTENT_WIDTH) / 2;
    const column = CONTENT_WIDTH / quiz.countryScores.length;

    quiz.countryScores.forEach((result, index) => {
      const row = createCountryScore(result);

      row.position.set(left + (index + 0.5) * column, COUNTRIES_Y);
      this.addChild(row);
      animate(this, POP_MS, (progress) => row.scale.set(popScale(progress)), COUNT_UP_MS + index * POP_GAP_MS);
    });

    // Side by side: the same country again, or back home to pick another.
    const country = quiz.countryScores[0].country;
    const buttonWidth = (CONTENT_WIDTH - CELL) / 2;
    const playAgain = createButton({
      width: buttonWidth,
      height: 8 * CELL,
      fill: MAIZE,
      label: createText({ text: text.playAgain, size: 36, fill: INDIGO, maxWidth: buttonWidth - 32 }),
      onTap: () => startQuiz(screens, country),
    });
    const otherCountries = createButton({
      width: buttonWidth,
      height: 8 * CELL,
      fill: ALPACA,
      label: createText({ text: text.otherCountries, size: 36, fill: INDIGO, maxWidth: buttonWidth - 32 }),
      onTap: () => screens.show(new HomeScreen(screens)),
    });

    playAgain.position.set(left + buttonWidth / 2, PLAY_AGAIN_Y);
    otherCountries.position.set(left + CONTENT_WIDTH - buttonWidth / 2, PLAY_AGAIN_Y);

    const confetti = new Confetti();

    // The results are shown again in the new language, without the count-up sound.
    const gear = createGearButton(() =>
      screens.show(new SettingsScreen(screens, () => new ResultScreen(screens, quiz, { quiet: true }))),
    );

    const sound = createSoundButton();
    const home = createHomeButton(() => screens.show(new HomeScreen(screens)));

    gear.position.set(GEAR_X, GEAR_Y);
    sound.position.set(GEAR_X, SOUND_Y);
    home.position.set(GEAR_X, HOME_Y);
    this.addChild(createCreatorsList(FIRST_CREATOR_Y), playAgain, otherCountries, gear, sound, home, confetti);
    confetti.rain(BASE_CONFETTI + quiz.score * CONFETTI_PER_POINT, DESIGN_WIDTH);
    if (!quiet) {
      playSound('finish');
    }
  }
}

/** A country's flag, name and score, stacked. The numbers need no translating. */
function createCountryScore({ country, score, total }: Quiz['countryScores'][number]): Container {
  const stack = new Container();
  const flag = createFlag(STOPS[COUNTRIES.indexOf(country) + 1].flag);
  const name = createText({
    text: t().countries[country],
    size: 28,
    fill: ALPACA,
    maxWidth: CONTENT_WIDTH / COUNTRIES.length - 12,
    maxHeight: COUNTRY_NAME_MAX_HEIGHT,
  });
  const result = createText({ text: `${score} / ${total}`, size: 44, fill: MAIZE, maxWidth: CONTENT_WIDTH / COUNTRIES.length });

  name.anchor.set(0.5);
  name.y = COUNTRY_NAME_OFFSET;
  result.anchor.set(0.5);
  result.y = COUNTRY_SCORE_OFFSET;
  stack.addChild(flag, name, result);

  return stack;
}
