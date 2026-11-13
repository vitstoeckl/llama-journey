import { describe, expect, it } from 'vitest';
import { LANGUAGES } from './i18n/languages';
import { COUNTRIES, QUESTIONS, QUESTIONS_PER_COUNTRY, WRONG_ANSWERS, type Question } from './questions';
import { Quiz, shuffle } from './quiz';

/** The same numbers on every run, so a test can never fail by bad luck. */
function seededRandom(seed: number): () => number {
  let state = seed;

  return () => {
    state = (state * 1664525 + 1013904223) % 2 ** 32;

    return state / 2 ** 32;
  };
}

function makeQuestion(id: string): Question {
  const words = {
    text: `${id}?`,
    correct: `${id} right`,
    wrong: [`${id} wrong 1`, `${id} wrong 2`, `${id} wrong 3`],
    explanation: `${id} because`,
  };

  return {
    id,
    country: 'japan',
    languages: {
      es: words,
      cs: words,
      en: { ...words, text: `${id}? (en)` },
      de: words,
      ja: words,
    },
  };
}

const THREE_QUESTIONS = ['a', 'b', 'c'].map(makeQuestion);

function wrongIndex(quiz: Quiz): number {
  return (quiz.current.correctIndex + 1) % quiz.current.answers.length;
}

describe('shuffle', () => {
  it('keeps every item and leaves the original alone', () => {
    const items = [1, 2, 3, 4, 5, 6];
    const shuffled = shuffle(items, seededRandom(1));

    expect([...shuffled].sort()).toEqual(items);
    expect(items).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('puts each item in each place about equally often', () => {
    const random = seededRandom(2);
    const runs = 8000;
    const firstPlace = [0, 0, 0, 0];

    for (let run = 0; run < runs; run++) {
      firstPlace[shuffle([0, 1, 2, 3], random)[0]]++;
    }

    for (const count of firstPlace) {
      expect(count / runs).toBeGreaterThan(0.22);
      expect(count / runs).toBeLessThan(0.28);
    }
  });
});

describe('Quiz', () => {
  it('asks in the given language, in the given order', () => {
    const quiz = new Quiz(THREE_QUESTIONS, 'en', seededRandom(3));

    expect(quiz.total).toBe(3);
    expect(quiz.current.text).toBe('a? (en)');
    expect(quiz.current.explanation).toBe('a because');
  });

  it('points correctIndex at the right answer wherever the shuffle puts it', () => {
    const random = seededRandom(4);
    const places = new Set<number>();

    for (let run = 0; run < 100; run++) {
      const { answers, correctIndex } = new Quiz(THREE_QUESTIONS, 'es', random).current;

      expect(answers[correctIndex]).toBe('a right');
      expect([...answers].sort()).toEqual(['a right', 'a wrong 1', 'a wrong 2', 'a wrong 3']);
      places.add(correctIndex);
    }

    expect(places).toEqual(new Set([0, 1, 2, 3]));
  });

  it('keeps the answers in the same order while a question is on screen', () => {
    const quiz = new Quiz(THREE_QUESTIONS, 'es', seededRandom(5));
    const before = [...quiz.current.answers];

    quiz.answer(0);

    expect(quiz.current.answers).toEqual(before);
  });

  it('changes language mid-game without moving the answers or losing the score', () => {
    const quiz = new Quiz(THREE_QUESTIONS, 'es', seededRandom(8));
    const correctBefore = quiz.current.correctIndex;

    quiz.answer(correctBefore);
    quiz.setLanguage('en');

    const { answers, correctIndex, text } = quiz.current;
    const english = THREE_QUESTIONS[0].languages.en;

    expect(text).toBe(english.text);
    expect(correctIndex).toBe(correctBefore);
    expect(answers[correctIndex]).toBe(english.correct);
    expect(new Set(answers)).toEqual(new Set([english.correct, ...english.wrong]));
    expect(quiz.chosenIndex).toBe(correctBefore);
    expect(quiz.score).toBe(1);
  });

  it('scores a point for a right answer and none for a wrong one', () => {
    const quiz = new Quiz(THREE_QUESTIONS, 'es', seededRandom(6));

    quiz.answer(quiz.current.correctIndex);
    expect(quiz.score).toBe(1);
    quiz.next();

    quiz.answer(wrongIndex(quiz));
    expect(quiz.score).toBe(1);
  });

  it('counts only the first answer to a question', () => {
    const right = new Quiz(THREE_QUESTIONS, 'es', seededRandom(7));
    const rightIndex = right.current.correctIndex;

    right.answer(rightIndex);
    right.answer(rightIndex);
    expect(right.score).toBe(1);

    const wrong = new Quiz(THREE_QUESTIONS, 'es', seededRandom(7));
    const firstChoice = wrongIndex(wrong);

    wrong.answer(firstChoice);
    wrong.answer(rightIndex);
    expect(wrong.score).toBe(0);
    expect(wrong.chosenIndex).toBe(firstChoice);
  });

  it('rejects an answer that does not exist', () => {
    const quiz = new Quiz(THREE_QUESTIONS, 'es', seededRandom(8));

    expect(() => quiz.answer(-1)).toThrow(RangeError);
    expect(() => quiz.answer(4)).toThrow(RangeError);
    expect(() => quiz.answer(1.5)).toThrow(RangeError);
    expect(quiz.chosenIndex).toBeNull();
  });

  it('will not move on from an unanswered question', () => {
    const quiz = new Quiz(THREE_QUESTIONS, 'es', seededRandom(9));

    expect(() => quiz.next()).toThrow();
    expect(quiz.completed).toBe(0);
  });

  it('clears the choice and counts progress when moving on', () => {
    const quiz = new Quiz(THREE_QUESTIONS, 'es', seededRandom(10));

    quiz.answer(0);
    quiz.next();

    expect(quiz.chosenIndex).toBeNull();
    expect(quiz.completed).toBe(1);
    expect(quiz.current.text).toBe('b?');
  });

  it('marks the last question, then finishes', () => {
    const quiz = new Quiz(THREE_QUESTIONS, 'es', seededRandom(11));

    for (let question = 0; question < 3; question++) {
      expect(quiz.finished).toBe(false);
      expect(quiz.onLastQuestion).toBe(question === 2);
      quiz.answer(0);
      quiz.next();
    }

    expect(quiz.finished).toBe(true);
    expect(quiz.completed).toBe(3);
    expect(() => quiz.current).toThrow();
    expect(() => quiz.next()).toThrow();
  });

  it('records whether each answer was right, once per question', () => {
    const quiz = new Quiz(THREE_QUESTIONS, 'es', seededRandom(14));

    expect(quiz.results).toEqual([]);
    quiz.answer(quiz.current.correctIndex);
    quiz.answer(wrongIndex(quiz));
    expect(quiz.results).toEqual([true]);
    quiz.next();
    expect(quiz.results).toEqual([true]);
    quiz.answer(wrongIndex(quiz));
    expect(quiz.results).toEqual([true, false]);
  });

  it('adds up the score of each country, in route order', () => {
    const quiz = new Quiz(QUESTIONS, 'es', seededRandom(15));

    expect(quiz.countryScores.map(({ score }) => score)).toEqual([0, 0, 0]);

    // Right on questions 1, 2, 6 and 11: two in the first country, one in each of the others.
    for (let question = 0; question < 15; question++) {
      quiz.answer([0, 1, 5, 10].includes(question) ? quiz.current.correctIndex : wrongIndex(quiz));
      quiz.next();
    }

    expect(quiz.countryScores).toEqual([
      { country: 'czechia', score: 2, total: 5 },
      { country: 'germany', score: 1, total: 5 },
      { country: 'japan', score: 1, total: 5 },
    ]);
    expect(quiz.score).toBe(4);
  });

  it('marks the first question about each country', () => {
    const quiz = new Quiz(QUESTIONS, 'es', seededRandom(13));
    const starts: number[] = [];

    for (let question = 0; question < 15; question++) {
      if (quiz.atCountryStart) {
        starts.push(question);
      }

      quiz.answer(0);
      quiz.next();
    }

    expect(starts).toEqual([0, 5, 10]);
    expect(quiz.atCountryStart).toBe(false);
  });

  it.each([0, 1, 7, 15])('scores %i out of 15 in a full game', (rightAnswers) => {
    const quiz = new Quiz(QUESTIONS, 'es', seededRandom(12));

    for (let question = 0; question < 15; question++) {
      quiz.answer(question < rightAnswers ? quiz.current.correctIndex : wrongIndex(quiz));
      quiz.next();
    }

    expect(quiz.finished).toBe(true);
    expect(quiz.score).toBe(rightAnswers);
  });
});

describe('QUESTIONS', () => {
  it('has 15 questions with different ids', () => {
    expect(QUESTIONS).toHaveLength(15);
    expect(new Set(QUESTIONS.map((question) => question.id)).size).toBe(15);
  });

  it('asks 5 about each country, in route order', () => {
    const expected = COUNTRIES.flatMap((country) => Array(QUESTIONS_PER_COUNTRY).fill(country));

    expect(QUESTIONS.map((question) => question.country)).toEqual(expected);
  });

  describe.each(LANGUAGES)('in %s', (language) => {
    it('fills in every question, with one right and three different wrong answers', () => {
      for (const question of QUESTIONS) {
        const { text, correct, wrong, explanation } = question.languages[language];

        expect(text.trim()).not.toBe('');
        expect(explanation.trim()).not.toBe('');
        expect(wrong).toHaveLength(WRONG_ANSWERS);

        for (const answer of [correct, ...wrong]) {
          expect(answer.trim()).not.toBe('');
        }

        expect(new Set([correct, ...wrong]).size).toBe(WRONG_ANSWERS + 1);
      }
    });
  });
});
