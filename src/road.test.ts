import { describe, expect, it } from 'vitest';
import { roadBlock } from './road';

const WIDTH = 576;
const blocks = Array.from({ length: 15 }, (_, question) => roadBlock(question, 15, 5, WIDTH));

describe('roadBlock', () => {
  it('fills the road exactly, from one end to the other', () => {
    expect(blocks[0].left).toBe(0);
    expect(blocks[14].right).toBeCloseTo(WIDTH);
  });

  it('moves the llama forward after every question', () => {
    for (let question = 0; question < 15; question++) {
      expect(blocks[question].right).toBeGreaterThan(blocks[question].left);

      if (question > 0) {
        expect(blocks[question].left).toBeGreaterThan(blocks[question - 1].right);
      }
    }
  });

  it('leaves a wider gap between countries than between questions', () => {
    const gap = (question: number) => blocks[question].left - blocks[question - 1].right;

    expect(gap(5)).toBeGreaterThan(gap(4));
    expect(gap(10)).toBeCloseTo(gap(5));
    expect(gap(11)).toBeCloseTo(gap(4));
  });
});
