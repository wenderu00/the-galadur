import { describe, test, expect } from 'vitest';
import { processCompletedBuildings, tick } from '../tick';
import { createInitialGameState } from '../engine';

const NOW = 1000000;

describe('processCompletedBuildings', () => {
  test('returns state unchanged when no buildings have completed', () => {
    const state = createInitialGameState(NOW);
    expect(processCompletedBuildings(state, NOW)).toEqual(state);
  });

  test('upgrades the building level when completesAt has passed', () => {
    const state = createInitialGameState(NOW);
    const withBuild = {
      ...state,
      buildQueue: [
        {
          buildingId: 'sawmill' as const,
          targetLevel: 1 as const,
          startedAt: NOW - 1000,
          completesAt: NOW - 1,
        },
      ],
    };
    const result = processCompletedBuildings(withBuild, NOW);
    expect(result.buildings['sawmill'].level).toBe(1);
    expect(result.buildQueue).toHaveLength(0);
  });

  test('does not complete a build whose completesAt is in the future', () => {
    const state = createInitialGameState(NOW);
    const withBuild = {
      ...state,
      buildQueue: [
        {
          buildingId: 'sawmill' as const,
          targetLevel: 1 as const,
          startedAt: NOW,
          completesAt: NOW + 5000,
        },
      ],
    };
    const result = processCompletedBuildings(withBuild, NOW);
    expect(result.buildings['sawmill'].level).toBe(0);
    expect(result.buildQueue).toHaveLength(1);
  });
});

describe('tick', () => {
  test('adds one tick of production to current resources', () => {
    const state = createInitialGameState(NOW);
    const after = tick(state, NOW + 1);
    expect(after.resources.current.wood).toBeCloseTo(state.resources.current.wood + 0.5);
  });

  test('completes a build that is due at this tick', () => {
    const state = createInitialGameState(NOW);
    const withBuild = {
      ...state,
      buildQueue: [
        {
          buildingId: 'sawmill' as const,
          targetLevel: 1 as const,
          startedAt: NOW,
          completesAt: NOW,
        },
      ],
    };
    const after = tick(withBuild, NOW);
    expect(after.buildings['sawmill'].level).toBe(1);
  });
});
