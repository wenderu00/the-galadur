import type { GameState } from './types';
import { addAmounts, clampToMax } from './math';
import { calculateProduction, calculateStorageCaps } from './production';

export function applyProductionTick(state: GameState, now: number): GameState {
  const production = calculateProduction(state.buildings, state.castleGoldRate);
  const newCurrent = clampToMax(
    addAmounts(state.resources.current, production),
    state.resources.max
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
    (entry) => !completedIds.has(entry.buildingId) || entry.completesAt > now
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

export function tick(state: GameState, now: number): GameState {
  const afterCompletions = processCompletedBuildings(state, now);
  return applyProductionTick(afterCompletions, now);
}
