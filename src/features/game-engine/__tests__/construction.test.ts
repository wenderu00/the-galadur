import { describe, test, expect } from 'vitest';
import { startConstruction } from '../construction';
import { createInitialGameState } from '../engine';
import type { GameState } from '../types';

const NOW = 1000000;

function richState(): GameState {
  const base = createInitialGameState(NOW);
  return {
    ...base,
    resources: {
      ...base.resources,
      current: { wood: 500, stone: 500, food: 500, gold: 500 },
    },
  };
}

describe('startConstruction', () => {
  test('fails with queue_full when a build is already in progress', () => {
    const state = richState();
    const busy: GameState = {
      ...state,
      buildQueue: [
        { buildingId: 'castle', targetLevel: 2, startedAt: NOW, completesAt: NOW + 45000 },
      ],
    };
    expect(startConstruction(busy, 'sawmill', NOW)).toMatchObject({ error: 'queue_full' });
  });

  test('fails with already_max_level when the building is at level 3', () => {
    const state = richState();
    const maxed: GameState = {
      ...state,
      buildings: { ...state.buildings, sawmill: { id: 'sawmill', level: 3 } },
    };
    expect(startConstruction(maxed, 'sawmill', NOW)).toMatchObject({ error: 'already_max_level' });
  });

  test('fails with cannot_afford when resources are insufficient', () => {
    const base = createInitialGameState(NOW);
    const broke: GameState = {
      ...base,
      resources: { ...base.resources, current: { wood: 0, stone: 0, food: 0, gold: 0 } },
    };
    expect(startConstruction(broke, 'sawmill', NOW)).toMatchObject({ error: 'cannot_afford' });
  });

  test('queues the build and deducts cost on success', () => {
    const result = startConstruction(richState(), 'sawmill', NOW);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.state.buildQueue).toHaveLength(1);
      expect(result.state.resources.current.stone).toBe(500 - 15);
    }
  });
});
