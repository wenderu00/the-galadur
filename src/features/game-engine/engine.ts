import {
  BUILDING_DEFINITIONS,
  ALL_BUILDING_IDS,
  getBuildingLevelDef,
} from '@/config/buildings';
import type {
  GameState,
  ResourceAmount,
  ResourceKind,
  ResourceStore,
  BuildingId,
  BuildingState,
  BuildingLevel,
  BuildQueueEntry,
  ConstructionResult,
} from './types';

export const RESOURCE_KINDS: ResourceKind[] = ['wood', 'stone', 'food', 'gold'];

export const GAME_STATE_VERSION = 1;

export const MAX_OFFLINE_SECONDS = 8 * 60 * 60;

function zeroAmount(): ResourceAmount {
  return { wood: 0, stone: 0, food: 0, gold: 0 };
}

function addAmounts(a: ResourceAmount, b: Partial<ResourceAmount>): ResourceAmount {
  return {
    wood: a.wood + (b.wood ?? 0),
    stone: a.stone + (b.stone ?? 0),
    food: a.food + (b.food ?? 0),
    gold: a.gold + (b.gold ?? 0),
  };
}

function subtractAmounts(a: ResourceAmount, b: ResourceAmount): ResourceAmount {
  return {
    wood: a.wood - b.wood,
    stone: a.stone - b.stone,
    food: a.food - b.food,
    gold: a.gold - b.gold,
  };
}

function clampToMax(amount: ResourceAmount, cap: ResourceAmount): ResourceAmount {
  return {
    wood: Math.min(amount.wood, cap.wood),
    stone: Math.min(amount.stone, cap.stone),
    food: Math.min(amount.food, cap.food),
    gold: Math.min(amount.gold, cap.gold),
  };
}

function scaleAmount(amount: ResourceAmount, multiplier: number): ResourceAmount {
  return {
    wood: amount.wood * multiplier,
    stone: amount.stone * multiplier,
    food: amount.food * multiplier,
    gold: amount.gold * multiplier,
  };
}

export function calculateProduction(
  buildings: Record<BuildingId, BuildingState>,
): ResourceAmount {
  return ALL_BUILDING_IDS.reduce<ResourceAmount>((total, id) => {
    const { level } = buildings[id];
    if (level === 0) return total;

    const def = getBuildingLevelDef(id, level as Exclude<BuildingLevel, 0>);
    return addAmounts(total, def.effects.productionPerTick);
  }, zeroAmount());
}

export function calculateStorageCaps(
  buildings: Record<BuildingId, BuildingState>,
): ResourceAmount {
  return ALL_BUILDING_IDS.reduce<ResourceAmount>((total, id) => {
    const { level } = buildings[id];
    if (level === 0) return total;

    const def = getBuildingLevelDef(id, level as Exclude<BuildingLevel, 0>);
    return addAmounts(total, def.effects.storageBonus);
  }, zeroAmount());
}

export function createInitialGameState(now: number = Date.now()): GameState {
  const buildings = ALL_BUILDING_IDS.reduce<Record<BuildingId, BuildingState>>(
    (acc, id) => {
      acc[id] = { id, level: id === 'castle' ? 1 : 0 };
      return acc;
    },
    {} as Record<BuildingId, BuildingState>,
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
    lastSavedAt: now,
    version: GAME_STATE_VERSION,
  };
}

export function canAfford(current: ResourceAmount, cost: ResourceAmount): boolean {
  return RESOURCE_KINDS.every((kind) => current[kind] >= cost[kind]);
}

export function deductCost(current: ResourceAmount, cost: ResourceAmount): ResourceAmount {
  const result = subtractAmounts(current, cost);
  return {
    wood: Math.max(0, result.wood),
    stone: Math.max(0, result.stone),
    food: Math.max(0, result.food),
    gold: Math.max(0, result.gold),
  };
}

export function startConstruction(
  state: GameState,
  buildingId: BuildingId,
  now: number,
): ConstructionResult {
  if (state.buildQueue.length > 0) {
    return { success: false, error: 'queue_full' };
  }

  const building = state.buildings[buildingId];
  const targetLevel = (building.level + 1) as BuildingLevel;

  if (building.level >= 3) {
    return { success: false, error: 'already_max_level' };
  }

  if (targetLevel > BUILDING_DEFINITIONS[buildingId].maxLevel) {
    return { success: false, error: 'max_level' };
  }

  const levelDef = getBuildingLevelDef(
    buildingId,
    targetLevel as Exclude<BuildingLevel, 0>,
  );

  if (!canAfford(state.resources.current, levelDef.cost)) {
    return { success: false, error: 'cannot_afford' };
  }

  const entry: BuildQueueEntry = {
    buildingId,
    targetLevel: targetLevel as Exclude<BuildingLevel, 0>,
    startedAt: now,
    completesAt: now + levelDef.buildTimeSeconds * 1000,
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

export function processCompletedBuildings(state: GameState, now: number): GameState {
  const completedEntries = state.buildQueue
    .filter((entry) => entry.completesAt <= now)
    .sort((a, b) => a.completesAt - b.completesAt);

  if (completedEntries.length === 0) return state;

  let buildings = { ...state.buildings };

  for (const entry of completedEntries) {
    buildings = {
      ...buildings,
      [entry.buildingId]: {
        ...buildings[entry.buildingId],
        level: entry.targetLevel,
      },
    };
  }

  const completedIds = new Set(completedEntries.map((e) => e.buildingId));
  const remainingQueue = state.buildQueue.filter(
    (entry) => !completedIds.has(entry.buildingId) || entry.completesAt > now,
  );

  const newMaxStorage = calculateStorageCaps(buildings);

  return {
    ...state,
    buildings,
    buildQueue: remainingQueue,
    resources: {
      current: clampToMax(state.resources.current, newMaxStorage),
      max: newMaxStorage,
    },
  };
}

export function applyProductionTick(state: GameState, now: number): GameState {
  const production = calculateProduction(state.buildings);
  const newCurrent = clampToMax(
    addAmounts(state.resources.current, production),
    state.resources.max,
  );

  return {
    ...state,
    resources: {
      ...state.resources,
      current: newCurrent,
    },
    lastSavedAt: now,
  };
}

export function tick(state: GameState, now: number): GameState {
  const afterCompletions = processCompletedBuildings(state, now);
  return applyProductionTick(afterCompletions, now);
}

export function calculateOfflineProgress(state: GameState, now: number): GameState {
  const elapsedSeconds = Math.floor((now - state.lastSavedAt) / 1000);

  if (elapsedSeconds <= 0) return state;

  const cappedSeconds = Math.min(elapsedSeconds, MAX_OFFLINE_SECONDS);
  const simulationEnd = state.lastSavedAt + cappedSeconds * 1000;

  const sortedQueue = [...state.buildQueue].sort(
    (a, b) => a.completesAt - b.completesAt,
  );

  let currentState = state;
  let cursor = state.lastSavedAt;

  for (const entry of sortedQueue) {
    if (entry.completesAt > simulationEnd) break;

    const segmentSeconds = Math.max(0, Math.floor((entry.completesAt - cursor) / 1000));

    if (segmentSeconds > 0) {
      const production = calculateProduction(currentState.buildings);
      const gained = scaleAmount(production, segmentSeconds);
      const newCurrent = clampToMax(
        addAmounts(currentState.resources.current, gained),
        currentState.resources.max,
      );
      currentState = {
        ...currentState,
        resources: { ...currentState.resources, current: newCurrent },
      };
    }

    currentState = processCompletedBuildings(currentState, entry.completesAt);
    cursor = entry.completesAt;
  }

  const remainingSeconds = Math.max(0, Math.floor((simulationEnd - cursor) / 1000));
  if (remainingSeconds > 0) {
    const production = calculateProduction(currentState.buildings);
    const gained = scaleAmount(production, remainingSeconds);
    const newCurrent = clampToMax(
      addAmounts(currentState.resources.current, gained),
      currentState.resources.max,
    );
    currentState = {
      ...currentState,
      resources: { ...currentState.resources, current: newCurrent },
    };
  }

  return {
    ...currentState,
    lastSavedAt: now,
  };
}

export function safeParseGameState(raw: unknown): GameState | null {
  if (typeof raw !== 'object' || raw === null) return null;

  const candidate = raw as Record<string, unknown>;

  if (candidate['version'] !== GAME_STATE_VERSION) return null;

  if (
    typeof candidate['resources'] !== 'object' ||
    typeof candidate['buildings'] !== 'object' ||
    !Array.isArray(candidate['buildQueue']) ||
    typeof candidate['lastSavedAt'] !== 'number'
  ) {
    return null;
  }

  return raw as GameState;
}
