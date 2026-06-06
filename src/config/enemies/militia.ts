import type { EnemyDefinition } from '@/features/game-engine/combat-types';

export const militia: EnemyDefinition = {
  id: 'militia',
  name: 'Milícia Regional',
  power: 50,
  loot: { gold: 60, food: 40 },
  requiredDefeats: 3,
  description: 'Soldados profissionais protegendo territórios vizinhos.',
};
