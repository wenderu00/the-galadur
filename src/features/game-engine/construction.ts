import { BUILDING_DEFINITIONS, getBuildingLevelDef } from '@/config/buildings';
import type { GameState, BuildingId, BuildingLevel, BuildQueueEntry } from './types';

export type ConstructionResult =
  | { success: true; state: GameState }
  | { success: false; error: 'queue_full' | 'max_level' | 'cannot_afford' | 'already_max_level' };
import { canAfford, deductCost } from './math';
import { calculateConstructionTimeMultiplier } from './production';

export function rescaleQueueForSpeedChange(
  state: GameState,
  now: number,
  oldSpeed: number,
  newSpeed: number
): GameState {
  if (oldSpeed === newSpeed || state.buildQueue.length === 0) return state;

  const rescaledQueue = state.buildQueue.map((entry) => {
    const remainingRealMs = entry.completesAt - now;
    if (remainingRealMs <= 0) return entry;
    return { ...entry, completesAt: now + (remainingRealMs * oldSpeed) / newSpeed };
  });

  return { ...state, buildQueue: rescaledQueue };
}

export function startConstruction(
  state: GameState,
  buildingId: BuildingId,
  now: number,
  speed: number = 1
): ConstructionResult {
  if (state.buildQueue.length > 0) {
    return { success: false, error: 'queue_full' };
  }

  const building = state.buildings[buildingId];
  const targetLevel = (building.level + 1) as BuildingLevel;

  if (building.level >= BUILDING_DEFINITIONS[buildingId].maxLevel) {
    return { success: false, error: 'already_max_level' };
  }

  const levelDef = getBuildingLevelDef(buildingId, targetLevel as Exclude<BuildingLevel, 0>);

  if (!canAfford(state.resources.current, levelDef.cost)) {
    return { success: false, error: 'cannot_afford' };
  }

  const constructionMultiplier = calculateConstructionTimeMultiplier(state.buildings);

  const entry: BuildQueueEntry = {
    buildingId,
    targetLevel: targetLevel as Exclude<BuildingLevel, 0>,
    startedAt: now,
    completesAt: now + (levelDef.buildTimeSeconds * 1000 * constructionMultiplier) / speed,
  };

  const newState: GameState = {
    ...state,
    resources: {
      ...state.resources,
      current: deductCost(state.resources.current, levelDef.cost),
    },
    buildQueue: [...state.buildQueue, entry],
    lastSavedAt: now,
  };

  return { success: true, state: newState };
}
