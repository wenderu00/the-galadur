import type { UnitDefinition } from '@/features/game-engine/military-types';

export const warrior: UnitDefinition = {
  id: 'warrior',
  name: 'Guerreiro',
  baseCost: { wood: 0, stone: 0, food: 20, gold: 10 },
  baseTrainingSeconds: 30,
  unlockedAtBarracksLevel: 1,
};
