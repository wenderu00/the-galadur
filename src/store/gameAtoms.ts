import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import {
  createInitialGameState,
  safeParseGameState,
  GAME_STATE_VERSION,
  calculateProduction,
} from '@/features/game-engine/engine';
import type {
  GameState,
  BuildingId,
  BuildingState,
  ResourceStore,
  ResourceAmount,
  BuildQueueEntry,
} from '@/features/game-engine/types';

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
          console.warn(
            `[Galadur] Schema v${GAME_STATE_VERSION} incompatível. Resetando estado.`,
          );
          return createInitialGameState();
        }

        return validated;
      } catch {
        return initialValue;
      }
    },
  },
  { getOnInit: true },
);

export const resourcesAtom = atom<ResourceStore>((get) => get(gameStateAtom).resources);

export const buildingsAtom = atom<Record<BuildingId, BuildingState>>(
  (get) => get(gameStateAtom).buildings,
);

export const buildQueueAtom = atom<BuildQueueEntry[]>(
  (get) => get(gameStateAtom).buildQueue,
);

export const activeBuildAtom = atom<BuildQueueEntry | null>(
  (get) => get(buildQueueAtom)[0] ?? null,
);

export const isConstructingAtom = atom<boolean>(
  (get) => get(buildQueueAtom).length > 0,
);

export const lastSavedAtAtom = atom<number>((get) => get(gameStateAtom).lastSavedAt);

export const castleGoldRateAtom = atom<number>((get) => get(gameStateAtom).castleGoldRate);

export const productionAtom = atom<ResourceAmount>((get) =>
  calculateProduction(get(buildingsAtom), get(castleGoldRateAtom)),
);

export const tickCountAtom = atom<number>(0);

export const gameDayAtom = atom<number>((get) => get(tickCountAtom) + 1);

export type GameSpeed = 0 | 0.5 | 1 | 2 | 4;

export const gameSpeedAtom = atom<GameSpeed>(1);
