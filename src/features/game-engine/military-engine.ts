import type { GameState } from './types';
import type { UnitId, TrainingQueueEntry } from './military-types';
import { UNIT_DEFINITIONS } from '@/config/units';
import { canAfford, deductCost } from './engine';

export type TrainingResult =
  | { success: true; state: GameState }
  | {
      success: false;
      error: 'barracks_not_built' | 'unit_locked' | 'cannot_afford' | 'queue_full';
    };

const TRAINING_MULTIPLIERS: Record<1 | 2 | 3, number> = { 1: 1.0, 2: 0.8, 3: 0.6 };

export function getUnlockedUnitIds(barracksLevel: number): UnitId[] {
  return Object.values(UNIT_DEFINITIONS)
    .filter((u) => u.unlockedAtBarracksLevel <= barracksLevel)
    .map((u) => u.id);
}

export function startTraining(
  state: GameState,
  unitId: UnitId,
  now: number,
  speed: number = 1,
): TrainingResult {
  const barracksLevel = state.buildings['barracks'].level;
  if (barracksLevel === 0) return { success: false, error: 'barracks_not_built' };
  if (!getUnlockedUnitIds(barracksLevel).includes(unitId))
    return { success: false, error: 'unit_locked' };
  if (state.trainingQueue.length > 0) return { success: false, error: 'queue_full' };
  const unit = UNIT_DEFINITIONS[unitId];
  if (!canAfford(state.resources.current, unit.baseCost))
    return { success: false, error: 'cannot_afford' };
  const mult = TRAINING_MULTIPLIERS[barracksLevel as 1 | 2 | 3];
  const entry: TrainingQueueEntry = {
    unitId,
    startedAt: now,
    completesAt: now + (unit.baseTrainingSeconds * 1000 * mult) / speed,
  };
  return {
    success: true,
    state: {
      ...state,
      resources: {
        ...state.resources,
        current: deductCost(state.resources.current, unit.baseCost),
      },
      trainingQueue: [...state.trainingQueue, entry],
    },
  };
}

export function processCompletedTraining(
  state: GameState,
  now: number,
): { state: GameState; completed: UnitId[] } {
  const done = state.trainingQueue.filter((e) => e.completesAt <= now);
  if (done.length === 0) return { state, completed: [] };
  const newUnits = { ...state.militaryUnits };
  for (const e of done) newUnits[e.unitId] = (newUnits[e.unitId] ?? 0) + 1;
  const remaining = state.trainingQueue.filter((e) => e.completesAt > now);
  return {
    state: { ...state, trainingQueue: remaining, militaryUnits: newUnits },
    completed: done.map((e) => e.unitId),
  };
}

export function rescaleTrainingQueue(
  state: GameState,
  now: number,
  oldSpeed: number,
  newSpeed: number,
): GameState {
  if (oldSpeed === newSpeed || state.trainingQueue.length === 0) return state;
  const queue = state.trainingQueue.map((e) => {
    const rem = e.completesAt - now;
    return rem <= 0 ? e : { ...e, completesAt: now + (rem * oldSpeed) / newSpeed };
  });
  return { ...state, trainingQueue: queue };
}
