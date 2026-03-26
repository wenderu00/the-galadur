import type { ResourceAmount } from './types';

export type UnitId = 'warrior' | 'archer' | 'lancer';

export type MilitaryUnits = Record<UnitId, number>;

export interface TrainingQueueEntry {
  unitId: UnitId;
  startedAt: number;
  completesAt: number;
}

export interface UnitDefinition {
  id: UnitId;
  name: string;
  baseCost: ResourceAmount;
  baseTrainingSeconds: number;
  unlockedAtBarracksLevel: 1 | 2 | 3;
}
