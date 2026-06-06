import { describe, test, expect } from 'vitest';
import { createInitialGameState, safeParseGameState, GAME_STATE_VERSION } from '../engine';

describe('createInitialGameState', () => {
  test('castle starts at level 1 and all other buildings at level 0', () => {
    const state = createInitialGameState();
    expect(state.buildings['castle'].level).toBe(1);
    expect(state.buildings['sawmill'].level).toBe(0);
  });

  test('initial resources are set correctly', () => {
    const state = createInitialGameState();
    expect(state.resources.current).toEqual({ wood: 50, stone: 30, food: 20, gold: 0 });
  });
});

describe('safeParseGameState', () => {
  test('returns null for non-object input', () => {
    expect(safeParseGameState('string')).toBeNull();
    expect(safeParseGameState(null)).toBeNull();
    expect(safeParseGameState(42)).toBeNull();
  });

  test('returns null for an unknown schema version', () => {
    expect(safeParseGameState({ version: 99 })).toBeNull();
  });

  test('migrates version 1 state by adding military fields', () => {
    const v1 = createInitialGameState();
    const raw = { ...v1, version: 1 };
    const migrated = safeParseGameState(raw);
    expect(migrated).not.toBeNull();
    expect(migrated?.version).toBe(GAME_STATE_VERSION);
    expect(migrated?.militaryUnits).toEqual({ warrior: 0, archer: 0, lancer: 0 });
  });

  test('returns a valid current-version state as-is', () => {
    const state = createInitialGameState();
    const result = safeParseGameState(state);
    expect(result).not.toBeNull();
    expect(result?.resources).toEqual(state.resources);
  });

  test('returns null when required fields are missing', () => {
    expect(safeParseGameState({ version: GAME_STATE_VERSION })).toBeNull();
  });
});
