import { describe, test, expect } from 'vitest';
import { calculateOfflineProgress, MAX_OFFLINE_SECONDS } from '../offline';
import { createInitialGameState } from '../engine';

const NOW = 1000000;

describe('calculateOfflineProgress', () => {
  test('returns state unchanged when no time has elapsed', () => {
    const state = createInitialGameState(NOW);
    expect(calculateOfflineProgress(state, NOW)).toEqual({ ...state, lastSavedAt: NOW });
  });

  test('accumulates production for elapsed seconds', () => {
    const state = createInitialGameState(NOW);
    const tenSecondsLater = NOW + 10_000;
    const result = calculateOfflineProgress(state, tenSecondsLater);
    expect(result.resources.current.wood).toBeCloseTo(50 + 0.5 * 10, 5);
  });

  test('caps simulation at MAX_OFFLINE_SECONDS regardless of actual elapsed time', () => {
    const state = createInitialGameState(NOW);
    const tooFarFuture = NOW + (MAX_OFFLINE_SECONDS + 3600) * 1000;
    const cappedResult = calculateOfflineProgress(state, tooFarFuture);
    const maxResult = calculateOfflineProgress(state, NOW + MAX_OFFLINE_SECONDS * 1000);
    expect(cappedResult.resources.current.wood).toBeCloseTo(maxResult.resources.current.wood, 5);
  });

  test('completes a build that finished during offline time', () => {
    const state = createInitialGameState(NOW);
    const completesAt = NOW + 5_000;
    const withBuild = {
      ...state,
      buildQueue: [
        { buildingId: 'sawmill' as const, targetLevel: 1 as const, startedAt: NOW, completesAt },
      ],
    };
    const result = calculateOfflineProgress(withBuild, NOW + 30_000);
    expect(result.buildings['sawmill'].level).toBe(1);
    expect(result.buildQueue).toHaveLength(0);
  });
});
