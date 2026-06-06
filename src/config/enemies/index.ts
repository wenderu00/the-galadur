import type { EnemyId } from '@/features/game-engine/combat-types';
import type { EnemyDefinition } from '@/features/game-engine/combat-types';
import { bandits } from './bandits';
import { raiders } from './raiders';
import { warband } from './warband';
import { militia } from './militia';
import { army } from './army';

export type { EnemyDefinition };

export const ENEMIES: Record<EnemyId, EnemyDefinition> = {
  bandits,
  raiders,
  warband,
  militia,
  army,
};

export const ALL_ENEMY_IDS: EnemyId[] = ['bandits', 'raiders', 'warband', 'militia', 'army'];
