import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TriviaState {
  score: number;
  total: number;
  recordAnswer: (correct: boolean) => void;
  reset: () => void;
}

export const useTriviaStore = create<TriviaState>()(
  persist(
    (set) => ({
      score: 0,
      total: 0,
      recordAnswer: (correct) =>
        set((state) => ({
          score: state.score + (correct ? 1 : 0),
          total: state.total + 1,
        })),
      reset: () => set({ score: 0, total: 0 }),
    }),
    { name: 'trivia-stats' },
  ),
);
