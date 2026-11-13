import type { Language } from './i18n';
import type { Country, Question } from './questions';

/** A question as the player sees it: in one language, with its answers in their shuffled order. */
export interface AskedQuestion {
  id: string;
  country: Country;
  text: string;
  answers: string[];
  correctIndex: number;
  explanation: string;
}

/** Returns a new array in random order. `random` works like Math.random. */
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const shuffled = [...items];

  for (let last = shuffled.length - 1; last > 0; last--) {
    const other = Math.floor(random() * (last + 1));

    [shuffled[last], shuffled[other]] = [shuffled[other], shuffled[last]];
  }

  return shuffled;
}

/**
 * The question in one language. `order` says where each answer goes: index 0 is the correct one,
 * the rest are the wrong ones. Keeping it means a change of language leaves the answers in place.
 */
function ask(question: Question, language: Language, order: readonly number[]): AskedQuestion {
  const { text, correct, wrong, explanation } = question.languages[language];
  const options = [correct, ...wrong];

  return {
    id: question.id,
    country: question.country,
    text,
    answers: order.map((index) => options[index]),
    correctIndex: order.indexOf(0),
    explanation,
  };
}

/** One playthrough. It knows nothing about screens, so it can be tested on its own. */
export class Quiz {
  private readonly sources: readonly Question[];
  private readonly orders: number[][];
  private questions: AskedQuestion[];
  private position = 0;
  private chosen: number | null = null;
  private points = 0;
  private readonly outcomes: boolean[] = [];

  constructor(questions: readonly Question[], language: Language, random: () => number = Math.random) {
    this.sources = questions;
    this.orders = questions.map((question) =>
      shuffle(
        [question.languages[language].correct, ...question.languages[language].wrong].map((_, index) => index),
        random,
      ),
    );
    this.questions = this.ask(language);
  }

  /** Shows every question in another language, keeping the answers, their order and the score. */
  setLanguage(language: Language): void {
    this.questions = this.ask(language);
  }

  private ask(language: Language): AskedQuestion[] {
    return this.sources.map((question, index) => ask(question, language, this.orders[index]));
  }

  get total(): number {
    return this.questions.length;
  }

  /** How many questions the player has moved past. Equals `total` when the game is over. */
  get completed(): number {
    return this.position;
  }

  get score(): number {
    return this.points;
  }

  /** Whether each answer so far was right, in order, including the one on screen. */
  get results(): readonly boolean[] {
    return this.outcomes;
  }

  /** How each country went so far, in route order. */
  get countryScores(): { country: Country; score: number; total: number }[] {
    const scores = new Map<Country, { country: Country; score: number; total: number }>();

    this.questions.forEach(({ country }, index) => {
      const entry = scores.get(country) ?? { country, score: 0, total: 0 };

      entry.total++;
      entry.score += this.outcomes[index] ? 1 : 0;
      scores.set(country, entry);
    });

    return [...scores.values()];
  }

  get finished(): boolean {
    return this.position >= this.total;
  }

  get onLastQuestion(): boolean {
    return this.position === this.total - 1;
  }

  /** True on the first question about each country, which is when the llama travels there. */
  get atCountryStart(): boolean {
    return (
      !this.finished &&
      (this.position === 0 || this.questions[this.position].country !== this.questions[this.position - 1].country)
    );
  }

  get current(): AskedQuestion {
    if (this.finished) {
      throw new Error('The quiz is over: there is no current question.');
    }

    return this.questions[this.position];
  }

  /** The answer the player picked for the current question, or null if they have not yet. */
  get chosenIndex(): number | null {
    return this.chosen;
  }

  /** Records the player's answer. Only the first one counts, so a double tap cannot score twice. */
  answer(index: number): void {
    const { answers, correctIndex } = this.current;

    if (!Number.isInteger(index) || index < 0 || index >= answers.length) {
      throw new RangeError(`There is no answer ${index}.`);
    }

    if (this.chosen !== null) {
      return;
    }

    this.chosen = index;
    this.outcomes.push(index === correctIndex);

    if (index === correctIndex) {
      this.points++;
    }
  }

  /** Moves on to the next question, which is only possible once this one is answered. */
  next(): void {
    if (this.finished || this.chosen === null) {
      throw new Error('Answer the current question before moving on.');
    }

    this.position++;
    this.chosen = null;
  }
}
