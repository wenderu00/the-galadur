import type { EnemyDefinition } from '@/features/game-engine/combat-types';

export const army: EnemyDefinition = {
  id: 'army',
  name: 'Exército Imperial',
  power: 100,
  loot: { gold: 100, wood: 50, stone: 50 },
  requiredDefeats: 4,
  description: 'O exército de um império rival, formidável e temido.',
};
