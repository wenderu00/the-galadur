import { ALL_BUILDING_IDS } from '@/config/buildings';
import type { GameState, BuildingId, BuildingState, ResourceStore } from './types';
import { calculateStorageCaps } from './production';

export const GAME_STATE_VERSION = 2;

export function createInitialGameState(now: number = Date.now()): GameState {
  const buildings = ALL_BUILDING_IDS.reduce<Record<BuildingId, BuildingState>>(
    (acc, id) => {
      acc[id] = { id, level: id === 'castle' ? 1 : 0 };
      return acc;
    },
    {} as Record<BuildingId, BuildingState>
  );

  const maxStorage = calculateStorageCaps(buildings);

  const initialResources: ResourceStore = {
    current: { wood: 50, stone: 30, food: 20, gold: 0 },
    max: maxStorage,
  };

  return {
    resources: initialResources,
    buildings,
    buildQueue: [],
    trainingQueue: [],
    militaryUnits: { warrior: 0, archer: 0, lancer: 0 },
    lastSavedAt: now,
    version: GAME_STATE_VERSION,
    castleGoldRate: 0,
  };
}

export function safeParseGameState(raw: unknown): GameState | null {
  if (typeof raw !== 'object' || raw === null) return null;

  const candidate = raw as Record<string, unknown>;

  if (candidate['version'] === 1) {
    return safeParseGameState({
      ...candidate,
      version: 2,
      trainingQueue: [],
      militaryUnits: { warrior: 0, archer: 0, lancer: 0 },
    });
  }

  if (candidate['version'] !== GAME_STATE_VERSION) return null;

  if (
    typeof candidate['resources'] !== 'object' ||
    typeof candidate['buildings'] !== 'object' ||
    !Array.isArray(candidate['buildQueue']) ||
    typeof candidate['lastSavedAt'] !== 'number'
  ) {
    return null;
  }

  const state = raw as GameState;
  return typeof state.castleGoldRate === 'number' ? state : { ...state, castleGoldRate: 0 };
}

export {
  RESOURCE_KINDS,
  canAfford,
  deductCost,
  zeroAmount,
  addAmounts,
  subtractAmounts,
  clampToMax,
  scaleAmount,
} from './math';
export {
  calculateProduction,
  calculateStorageCaps,
  calculateConstructionTimeMultiplier,
} from './production';
export { tick, applyProductionTick, processCompletedBuildings } from './tick';
export { startConstruction, rescaleQueueForSpeedChange } from './construction';
export { MAX_OFFLINE_SECONDS, calculateOfflineProgress } from './offline';
