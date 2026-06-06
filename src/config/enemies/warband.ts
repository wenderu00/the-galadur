import type { EnemyDefinition } from '@/features/game-engine/combat-types';

export const warband: EnemyDefinition = {
  id: 'warband',
  name: 'Horda de Guerra',
  power: 25,
  loot: { gold: 35, stone: 20 },
  requiredDefeats: 2,
  description: 'Uma horda disciplinada com armamentos pesados.',
};
