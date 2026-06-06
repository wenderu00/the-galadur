import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { createInitialGameState, safeParseGameState } from '@/features/game-engine/engine';
import type { GameState } from '@/features/game-engine/types';

const safeGameStorage = createJSONStorage<GameState>(() => localStorage, {
  reviver: (_key: string, value: unknown) => value,
});

const STORAGE_KEY = 'galadur-state';

export const gameStateAtom = atomWithStorage<GameState>(
  STORAGE_KEY,
  createInitialGameState(),
  {
    ...safeGameStorage,
    getItem: (key, initialValue) => {
      try {
        const raw = localStorage.getItem(key);
        if (raw === null) return initialValue;

        const parsed: unknown = JSON.parse(raw);
        const validated = safeParseGameState(parsed);

        if (validated === null) {
          return createInitialGameState();
        }

        return validated;
      } catch {
        return initialValue;
      }
    },
  },
  { getOnInit: true }
);
