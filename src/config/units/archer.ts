import type { UnitDefinition } from '@/features/game-engine/military-types';

export const archer: UnitDefinition = {
  id: 'archer',
  name: 'Arqueiro',
  baseCost: { wood: 0, stone: 0, food: 15, gold: 20 },
  baseTrainingSeconds: 45,
  unlockedAtBarracksLevel: 2,
};
