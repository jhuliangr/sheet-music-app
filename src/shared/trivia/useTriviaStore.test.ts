import { describe, it, expect, beforeEach } from 'vitest';
import { useTriviaStore } from './useTriviaStore';

describe('shared/trivia/useTriviaStore', () => {
  beforeEach(() => {
    useTriviaStore.setState({ score: 0, total: 0 });
  });

  it('works', () => {
    expect(useTriviaStore.getState()).toBeDefined();
  });

  it('starts with zero score and total', () => {
    const { score, total } = useTriviaStore.getState();
    expect(score).toBe(0);
    expect(total).toBe(0);
  });

  it('recordAnswer increments total and score only on correct answer', () => {
    useTriviaStore.getState().recordAnswer(true);
    expect(useTriviaStore.getState()).toMatchObject({ score: 1, total: 1 });

    useTriviaStore.getState().recordAnswer(false);
    expect(useTriviaStore.getState()).toMatchObject({ score: 1, total: 2 });
  });

  it('reset clears both score and total', () => {
    useTriviaStore.getState().recordAnswer(true);
    useTriviaStore.getState().recordAnswer(true);
    useTriviaStore.getState().reset();
    expect(useTriviaStore.getState()).toMatchObject({ score: 0, total: 0 });
  });
});
