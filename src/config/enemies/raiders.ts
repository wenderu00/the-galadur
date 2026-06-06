import type { EnemyDefinition } from '@/features/game-engine/combat-types';

export const raiders: EnemyDefinition = {
  id: 'raiders',
  name: 'Invasores',
  power: 12,
  loot: { gold: 20, wood: 15 },
  requiredDefeats: 1,
  description: 'Guerreiros nômades com experiência em combate.',
};
