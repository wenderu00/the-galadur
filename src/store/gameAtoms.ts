import { atom } from 'jotai';
import { calculateProduction } from '@/features/game-engine/engine';
import type {
  BuildingId,
  BuildingState,
  ResourceStore,
  ResourceAmount,
  BuildQueueEntry,
  MilitaryUnits,
  TrainingQueueEntry,
  EnemyId,
} from '@/features/game-engine/types';
import { gameStateAtom } from './gameStateAtom';

export { gameStateAtom };

export const resourcesAtom = atom<ResourceStore>((get) => get(gameStateAtom).resources);

export const buildingsAtom = atom<Record<BuildingId, BuildingState>>(
  (get) => get(gameStateAtom).buildings
);

export const buildQueueAtom = atom<BuildQueueEntry[]>((get) => get(gameStateAtom).buildQueue);

export const activeBuildAtom = atom<BuildQueueEntry | null>(
  (get) => get(buildQueueAtom)[0] ?? null
);

export const isConstructingAtom = atom<boolean>((get) => get(buildQueueAtom).length > 0);

export const lastSavedAtAtom = atom<number>((get) => get(gameStateAtom).lastSavedAt);

export const castleGoldRateAtom = atom<number>((get) => get(gameStateAtom).castleGoldRate);

export const productionAtom = atom<ResourceAmount>((get) =>
  calculateProduction(get(buildingsAtom), get(castleGoldRateAtom))
);

export const militaryUnitsAtom = atom<MilitaryUnits>((get) => get(gameStateAtom).militaryUnits);

export const trainingQueueAtom = atom<TrainingQueueEntry[]>(
  (get) => get(gameStateAtom).trainingQueue
);

export const activeTrainingAtom = atom<TrainingQueueEntry | null>(
  (get) => get(trainingQueueAtom)[0] ?? null
);

export const isTrainingAtom = atom<boolean>((get) => get(trainingQueueAtom).length > 0);

export const defeatedEnemiesAtom = atom<EnemyId[]>((get) => get(gameStateAtom).defeatedEnemies);

export const tickCountAtom = atom<number>(0);

export const gameDayAtom = atom<number>((get) => get(tickCountAtom) + 1);

export type GameSpeed = 0 | 0.5 | 1 | 2 | 4;

export const gameSpeedAtom = atom<GameSpeed>(1);
