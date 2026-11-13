import { Graphics, type Container } from 'pixi.js';
import { createButton } from './button';
import { Confetti } from './confetti';
import { createGearButton } from './gearButton';
import { getLanguage, t } from './i18n';
import { createJourneyStrip, STRIP_HEIGHT } from './journeyStrip';
import { DESIGN_WIDTH } from './layout';
import { animate, popScale } from './motion';
import { QUESTIONS, type Country } from './questions';
import { Quiz } from './quiz';
import { ResultScreen } from './ResultScreen';
import type { ScreenManager } from './screens';
import { SettingsScreen } from './SettingsScreen';
import { playSound } from './sound';
import { createSoundButton } from './soundButton';
import { createText } from './text';
import { ALPACA, CELL, CHILCA, CONTENT_WIDTH, INDIGO, MADDER, MAIZE } from './theme';
import { TravelScreen } from './TravelScreen';
import { weave } from './woven';
import { WovenScreen } from './WovenScreen';

const LEFT = (DESIGN_WIDTH - CONTENT_WIDTH) / 2;
const RIGHT = LEFT + CONTENT_WIDTH;
const STATUS_TOP = 56;
const STRIP_TOP = 100;
const GEAR_X = 334;
const SOUND_X = 398;
const SOUND_Y = 74;

// The answers stay in one place, so the tapped one changes colour under the player's
// finger. The space above them holds the question alone, then also the explanation.
const QUESTION_TOP = STRIP_TOP + STRIP_HEIGHT + 8;
const ASKING_HEIGHT = 273;
const ANSWERED_QUESTION_HEIGHT = 104;
const VERDICT_Y = 541;
const EXPLANATION_TOP = 563;
const EXPLANATION_HEIGHT = 129;
const ANSWERS_TOP = 700;
const ANSWER_HEIGHT = 8 * CELL;
const ANSWER_GAP = CELL;
const ANSWER_TEXT_WIDTH = CONTENT_WIDTH - 160;
const ANSWER_TEXT_HEIGHT = ANSWER_HEIGHT - 12;
const NEXT_Y = 1178;
const VERDICT_POP_MS = 350;
const BURST_PIECES = 24;

const MARKER_CELL = 6;
const RIGHT_MARKER = ['....X', '...XX', 'X.XX.', 'XXX..', '.X...'];
const WRONG_MARKER = ['X...X', '.X.X.', '..X..', '.X.X.', 'X...X'];

/** Starts a new game about one country, in the current language. */
export function startQuiz(screens: ScreenManager, country: Country): void {
  showQuestion(screens, new Quiz(QUESTIONS.filter((question) => question.country === country), getLanguage()));
}

/** Opens the current question, after the journey there if it is the first about its country. */
function showQuestion(screens: ScreenManager, quiz: Quiz): void {
  const question = () => screens.show(new QuestionScreen(screens, quiz));

  if (quiz.atCountryStart) {
    screens.show(new TravelScreen(screens, quiz.current.country, question));
  } else {
    question();
  }
}

/** Draws one moment of the quiz. Each tap changes the quiz, then opens a new screen to show it. */
class QuestionScreen extends WovenScreen {
  constructor(screens: ScreenManager, quiz: Quiz) {
    super();

    // The language may have changed in the settings since the quiz began.
    quiz.setLanguage(getLanguage());

    const text = t();
    const { text: questionText, answers, explanation, correctIndex } = quiz.current;
    const chosen = quiz.chosenIndex;
    const answered = chosen !== null;

    const progress = createText({
      text: text.progress(quiz.completed + 1, quiz.total),
      size: 28,
      fill: ALPACA,
      maxWidth: CONTENT_WIDTH * 0.4,
      align: 'left',
    });

    progress.position.set(LEFT, STATUS_TOP);

    const score = createText({
      text: text.score(quiz.score),
      size: 28,
      fill: MAIZE,
      maxWidth: CONTENT_WIDTH * 0.3,
      align: 'right',
    });

    score.anchor.set(1, 0);
    score.position.set(RIGHT, STATUS_TOP);

    const question = createText({
      text: questionText,
      size: answered ? 26 : 36,
      fill: ALPACA,
      maxWidth: CONTENT_WIDTH,
      maxHeight: answered ? ANSWERED_QUESTION_HEIGHT : ASKING_HEIGHT,
    });

    question.anchor.set(0.5, answered ? 0 : 0.5);
    question.position.set(DESIGN_WIDTH / 2, answered ? QUESTION_TOP : QUESTION_TOP + ASKING_HEIGHT / 2);

    const strip = createJourneyStrip(quiz);

    const gear = createGearButton(() =>
      screens.show(new SettingsScreen(screens, () => new QuestionScreen(screens, quiz))),
    );
    const sound = createSoundButton();

    gear.position.set(GEAR_X, SOUND_Y);
    sound.position.set(SOUND_X, SOUND_Y);
    strip.y = STRIP_TOP;
    this.addChild(progress, score, gear, sound, strip, question);

    answers.forEach((answer, index) => {
      const button = createAnswerButton(answer, answerStyle(index, chosen, correctIndex), () => {
        quiz.answer(index);
        playSound(index === correctIndex ? 'right' : 'wrong');
        screens.show(new QuestionScreen(screens, quiz), { fade: false });
      });

      button.position.set(
        DESIGN_WIDTH / 2,
        ANSWERS_TOP + ANSWER_HEIGHT / 2 + index * (ANSWER_HEIGHT + ANSWER_GAP),
      );
      this.addChild(button);
    });

    if (!answered) {
      return;
    }

    const verdict = createText({
      text: chosen === correctIndex ? text.correct : text.wrong,
      size: 34,
      fill: MAIZE,
      maxWidth: CONTENT_WIDTH,
    });

    verdict.anchor.set(0.5);
    verdict.position.set(DESIGN_WIDTH / 2, VERDICT_Y);

    const explanationText = createText({
      text: explanation,
      size: 26,
      fill: ALPACA,
      maxWidth: CONTENT_WIDTH,
      maxHeight: EXPLANATION_HEIGHT,
      align: 'left',
      bold: false,
    });

    explanationText.position.set(LEFT, EXPLANATION_TOP);

    const next = createButton({
      width: CONTENT_WIDTH,
      height: ANSWER_HEIGHT,
      fill: MAIZE,
      label: createText({
        text: quiz.onLastQuestion ? text.seeResult : text.nextQuestion,
        size: 34,
        fill: INDIGO,
        maxWidth: CONTENT_WIDTH - 64,
      }),
      onTap: () => {
        quiz.next();

        if (quiz.finished) {
          screens.show(new ResultScreen(screens, quiz));
        } else {
          showQuestion(screens, quiz);
        }
      },
    });

    next.position.set(DESIGN_WIDTH / 2, NEXT_Y);
    this.addChild(verdict, explanationText, next);

    if (chosen === correctIndex) {
      const confetti = new Confetti();

      this.addChild(confetti);
      confetti.burst(DESIGN_WIDTH / 2, VERDICT_Y, BURST_PIECES);
      animate(this, VERDICT_POP_MS, (progress) => verdict.scale.set(popScale(progress)));
    }
  }
}

type AnswerStyle = 'open' | 'right' | 'wrong' | 'other';

function answerStyle(index: number, chosen: number | null, correctIndex: number): AnswerStyle {
  if (chosen === null) {
    return 'open';
  }

  if (index === correctIndex) {
    return 'right';
  }

  return index === chosen ? 'wrong' : 'other';
}

const ANSWER_FILLS: Record<AnswerStyle, number> = {
  open: ALPACA,
  right: CHILCA,
  wrong: INDIGO,
  other: MADDER,
};

/** Right and wrong answers also carry a mark, so the feedback does not rely on colour alone. */
function createAnswerButton(answer: string, style: AnswerStyle, onTap: () => void): Container {
  const button = createButton({
    width: CONTENT_WIDTH,
    height: ANSWER_HEIGHT,
    fill: ANSWER_FILLS[style],
    label: createText({
      text: answer,
      size: 28,
      fill: style === 'open' ? INDIGO : ALPACA,
      maxWidth: ANSWER_TEXT_WIDTH,
      maxHeight: ANSWER_TEXT_HEIGHT,
    }),
    marker: style === 'right' || style === 'wrong' ? createMark(style) : undefined,
    onTap,
  });

  // Once answered, the buttons only show the result.
  if (style !== 'open') {
    button.eventMode = 'none';
  }

  return button;
}

function createMark(style: 'right' | 'wrong'): Graphics {
  const pattern = style === 'right' ? RIGHT_MARKER : WRONG_MARKER;
  const size = pattern.length * MARKER_CELL;

  return weave(new Graphics(), pattern, { X: ALPACA }, -CONTENT_WIDTH / 2 + 36, -size / 2, MARKER_CELL);
}
