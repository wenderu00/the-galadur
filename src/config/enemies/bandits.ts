import type { EnemyDefinition } from '@/features/game-engine/combat-types';

export const bandits: EnemyDefinition = {
  id: 'bandits',
  name: 'Bandoleiros',
  power: 5,
  loot: { gold: 10, food: 5 },
  requiredDefeats: 0,
  description: 'Um bando de saqueadores mal organizados.',
};
