import { useState } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { gameStateAtom } from '@/store/gameAtoms';
import { eventLogAtom } from '@/store/eventLogAtom';
import { resolveBattle } from '@/features/game-engine/combat-engine';
import type { EnemyDefinition, BattleResult } from '@/features/game-engine/combat-types';
import type { UnitId, MilitaryUnits } from '@/features/game-engine/types';

function resolveRng(): () => number {
  const win = window as unknown as Record<string, unknown>;
  const override = win['__combatRngOverride'];
  return typeof override === 'function' ? (override as () => number) : Math.random;
}

export function useArmyActions() {
  const [gameState, setGameState] = useAtom(gameStateAtom);
  const setEvents = useSetAtom(eventLogAtom);
  const [selectedEnemy, setSelectedEnemy] = useState<EnemyDefinition | null>(null);
  const [mobilization, setMobilizationState] = useState<Partial<MilitaryUnits>>({});
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);

  function onSelectEnemy(enemy: EnemyDefinition) {
    setSelectedEnemy(enemy);
    setMobilizationState({});
  }

  function onCloseModal() {
    setSelectedEnemy(null);
    setMobilizationState({});
  }

  function onSetMobilization(unitId: UnitId, count: number) {
    setMobilizationState((prev) => ({ ...prev, [unitId]: count }));
  }

  function onConfirmAttack() {
    if (!selectedEnemy) return;
    const { state, result } = resolveBattle(gameState, mobilization, selectedEnemy, resolveRng());
    setGameState(state);
    setBattleResult(result);
    setSelectedEnemy(null);
    const message = result.won
      ? `Vitória contra ${selectedEnemy.name}! Saque recebido.`
      : `Derrota contra ${selectedEnemy.name}. Unidades perdidas.`;
    setEvents((prev) => [...prev, { timestamp: Date.now(), message }]);
  }

  function onCloseBattleResult() {
    setBattleResult(null);
  }

  return {
    selectedEnemy,
    battleResult,
    mobilization,
    onSelectEnemy,
    onCloseModal,
    onSetMobilization,
    onConfirmAttack,
    onCloseBattleResult,
  };
}
