import { UNIT_DEFINITIONS, ALL_UNIT_IDS } from '@/config/units';
import { addAmounts, clampToMax } from './math';
import type { GameState } from './types';
import type { MilitaryUnits } from './military-types';
import type { EnemyDefinition, BattleResult } from './combat-types';

function calculateArmyPower(mobilized: Partial<MilitaryUnits>): number {
  return ALL_UNIT_IDS.reduce((total, id) => {
    const count = mobilized[id] ?? 0;
    return total + count * UNIT_DEFINITIONS[id].power;
  }, 0);
}

export function resolveBattle(
  state: GameState,
  mobilized: Partial<MilitaryUnits>,
  enemy: EnemyDefinition,
  rng: () => number = Math.random
): { state: GameState; result: BattleResult } {
  const playerPower = calculateArmyPower(mobilized) * (0.8 + rng() * 0.4);
  const won = playerPower > enemy.power;

  if (won) {
    const newCurrent = addAmounts(state.resources.current, enemy.loot);
    const clamped = clampToMax(newCurrent, state.resources.max);
    const defeatedEnemies = state.defeatedEnemies.includes(enemy.id)
      ? state.defeatedEnemies
      : [...state.defeatedEnemies, enemy.id];
    return {
      state: { ...state, resources: { ...state.resources, current: clamped }, defeatedEnemies },
      result: { won: true, enemy: enemy.id, lootGained: enemy.loot, unitsSent: mobilized },
    };
  }

  const newUnits = { ...state.militaryUnits };
  for (const id of ALL_UNIT_IDS) {
    newUnits[id] = Math.max(0, newUnits[id] - (mobilized[id] ?? 0));
  }
  return {
    state: { ...state, militaryUnits: newUnits },
    result: { won: false, enemy: enemy.id, lootGained: {}, unitsSent: mobilized },
  };
}
