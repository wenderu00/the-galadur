import { describe, test, expect } from 'vitest';
import { resolveBattle } from '../combat-engine';
import { createInitialGameState } from '../engine';
import { ENEMIES } from '@/config/enemies';
import type { MilitaryUnits } from '../military-types';

const NOW = 1_000_000;

function stateWithUnits(units: Partial<MilitaryUnits>) {
  const base = createInitialGameState(NOW);
  return {
    ...base,
    militaryUnits: { warrior: 0, archer: 0, lancer: 0, ...units },
  };
}

describe('resolveBattle', () => {
  test('overpowered army beats weakest enemy and receives loot', () => {
    const state = stateWithUnits({ warrior: 50 });
    const bandits = ENEMIES.bandits;
    const goldBefore = state.resources.current.gold;

    const { result, state: next } = resolveBattle(state, { warrior: 50 }, bandits, () => 1.0);

    expect(result.won).toBe(true);
    expect(next.resources.current.gold).toBeGreaterThan(goldBefore);
    expect(next.militaryUnits.warrior).toBe(50);
  });

  test('tiny army loses to strongest enemy and mobilized units are removed', () => {
    const state = stateWithUnits({ warrior: 1 });
    const army = ENEMIES.army;

    const { result, state: next } = resolveBattle(state, { warrior: 1 }, army, () => 0.0);

    expect(result.won).toBe(false);
    expect(next.militaryUnits.warrior).toBe(0);
    expect(next.resources.current.gold).toBe(state.resources.current.gold);
  });

  test('partial mobilization only removes sent units on defeat', () => {
    const state = stateWithUnits({ warrior: 10, archer: 5 });
    const army = ENEMIES.army;

    const { state: next } = resolveBattle(state, { warrior: 3 }, army, () => 0.0);

    expect(next.militaryUnits.warrior).toBe(7);
    expect(next.militaryUnits.archer).toBe(5);
  });

  test('winning adds enemy to defeatedEnemies when not already there', () => {
    const state = stateWithUnits({ warrior: 50 });
    const bandits = ENEMIES.bandits;

    const { state: next } = resolveBattle(state, { warrior: 50 }, bandits, () => 1.0);

    expect(next.defeatedEnemies).toContain('bandits');
  });

  test('winning again does not duplicate defeatedEnemies entry', () => {
    const base = stateWithUnits({ warrior: 50 });
    const state: Parameters<typeof resolveBattle>[0] = { ...base, defeatedEnemies: ['bandits'] };
    const bandits = ENEMIES.bandits;

    const { state: next } = resolveBattle(state, { warrior: 50 }, bandits, () => 1.0);

    expect(next.defeatedEnemies.filter((e) => e === 'bandits').length).toBe(1);
  });

  test('defeat leaves defeatedEnemies unchanged', () => {
    const state = stateWithUnits({ warrior: 1 });
    const army = ENEMIES.army;

    const { state: next } = resolveBattle(state, { warrior: 1 }, army, () => 0.0);

    expect(next.defeatedEnemies).toEqual(state.defeatedEnemies);
  });

  test('victory loot is clamped to resource max', () => {
    const base = createInitialGameState(NOW);
    const state = {
      ...base,
      militaryUnits: { warrior: 50, archer: 0, lancer: 0 },
      resources: {
        ...base.resources,
        current: { ...base.resources.current, gold: base.resources.max.gold },
      },
    };
    const bandits = ENEMIES.bandits;

    const { state: next } = resolveBattle(state, { warrior: 50 }, bandits, () => 1.0);

    expect(next.resources.current.gold).toBeLessThanOrEqual(next.resources.max.gold);
  });
});
