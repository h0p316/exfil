import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Mode = 'easy' | 'medium' | 'hard';

export const MODE_POINTS: Record<Mode, number> = { easy: 100, medium: 250, hard: 500 };
export const HINT_COST: Record<Mode, number> = { easy: 0, medium: 50, hard: 150 };
export const HINT_LIMIT: Record<Mode, number> = { easy: 3, medium: 2, hard: 1 };

interface GameState {
  score: number;
  solved: Record<string, { points: number; at: number }>;
  wrongGuesses: number;
  streak: number;
  usedHints: Record<string, number>;
  solve: (challengeId: string, mode: Mode) => number;
  wrongGuess: () => void;
  useHint: (challengeId: string, mode: Mode) => void;
}

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      score: 0,
      solved: {},
      wrongGuesses: 0,
      streak: 0,
      usedHints: {},
      solve: (challengeId, mode) => {
        const { solved, streak, score } = get();
        if (solved[challengeId]) return 0;
        const base = MODE_POINTS[mode];
        const mult = streak + 1 >= 3 ? 1.5 : 1;
        const points = Math.round(base * mult);
        set({
          score: score + points,
          solved: { ...solved, [challengeId]: { points, at: Date.now() } },
          streak: streak + 1,
        });
        return points;
      },
      wrongGuess: () => set((s) => ({ wrongGuesses: s.wrongGuesses + 1, streak: 0 })),
      useHint: (challengeId, mode) => {
        const { usedHints, score } = get();
        const used = usedHints[challengeId] ?? 0;
        set({
          usedHints: { ...usedHints, [challengeId]: used + 1 },
          score: score - HINT_COST[mode],
        });
      },
    }),
    { name: 'fftd-progress' },
  ),
);
