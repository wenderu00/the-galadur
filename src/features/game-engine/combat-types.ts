import type { ResourceAmount } from './types';
import type { MilitaryUnits } from './military-types';

export type EnemyId = 'bandits' | 'raiders' | 'warband' | 'militia' | 'army';

export interface EnemyDefinition {
  id: EnemyId;
  name: string;
  power: number;
  loot: Partial<ResourceAmount>;
  requiredDefeats: number;
  description: string;
}

export interface BattleResult {
  won: boolean;
  enemy: EnemyId;
  lootGained: Partial<ResourceAmount>;
  unitsSent: Partial<MilitaryUnits>;
}
