import { describe, expect, it } from 'vitest';
import { QUESTION_SCENES } from './questionScenes';
import { QUESTIONS } from './questions';

describe('QUESTION_SCENES', () => {
  it('has a scene for every question and none for a question that does not exist', () => {
    expect(Object.keys(QUESTION_SCENES).sort()).toEqual(QUESTIONS.map(({ id }) => id).sort());
  });
});
