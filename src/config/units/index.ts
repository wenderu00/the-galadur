import type { UnitId } from '@/features/game-engine/military-types';
import type { UnitDefinition } from '@/features/game-engine/military-types';
import { warrior } from './warrior';
import { archer } from './archer';
import { lancer } from './lancer';

export type { UnitDefinition };

export const UNIT_DEFINITIONS: Record<UnitId, UnitDefinition> = {
  warrior,
  archer,
  lancer,
};

export const ALL_UNIT_IDS: UnitId[] = Object.keys(UNIT_DEFINITIONS) as UnitId[];
