import type { GameState } from './types';
import { addAmounts, clampToMax, scaleAmount } from './math';
import { calculateProduction } from './production';
import { processCompletedBuildings } from './tick';

export const MAX_OFFLINE_SECONDS = 8 * 60 * 60;

export function calculateOfflineProgress(state: GameState, now: number): GameState {
  const elapsedSeconds = Math.floor((now - state.lastSavedAt) / 1000);

  if (elapsedSeconds <= 0) return state;

  const cappedSeconds = Math.min(elapsedSeconds, MAX_OFFLINE_SECONDS);
  const simulationEnd = state.lastSavedAt + cappedSeconds * 1000;

  const sortedQueue = [...state.buildQueue].sort((a, b) => a.completesAt - b.completesAt);

  let currentState = state;
  let cursor = state.lastSavedAt;

  for (const entry of sortedQueue) {
    if (entry.completesAt > simulationEnd) break;

    const segmentSeconds = Math.max(0, Math.floor((entry.completesAt - cursor) / 1000));

    if (segmentSeconds > 0) {
      const production = calculateProduction(currentState.buildings, currentState.castleGoldRate);
      const gained = scaleAmount(production, segmentSeconds);
      const newCurrent = clampToMax(
        addAmounts(currentState.resources.current, gained),
        currentState.resources.max
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
    const production = calculateProduction(currentState.buildings, currentState.castleGoldRate);
    const gained = scaleAmount(production, remainingSeconds);
    const newCurrent = clampToMax(
      addAmounts(currentState.resources.current, gained),
      currentState.resources.max
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
