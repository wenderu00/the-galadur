import { ALL_BUILDING_IDS } from '@/config/buildings';
import type { GameState, BuildingId, BuildingState, ResourceStore } from './types';
import { calculateStorageCaps } from './production';
import { GAME_STATE_VERSION } from './state-migration';

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
    defeatedEnemies: [],
    lastSavedAt: now,
    version: GAME_STATE_VERSION,
    castleGoldRate: 0,
  };
}
export { GAME_STATE_VERSION, safeParseGameState } from './state-migration';
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
export {
  executeTrade,
  getTradePreview,
  type TradeResource,
  type TradeDirection,
  type TradeResult,
} from './trade';
