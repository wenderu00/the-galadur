import type { UnitDefinition } from '@/features/game-engine/military-types';

export const lancer: UnitDefinition = {
  id: 'lancer',
  name: 'Lanceiro',
  baseCost: { wood: 5, stone: 0, food: 25, gold: 15 },
  baseTrainingSeconds: 60,
  unlockedAtBarracksLevel: 3,
};
