import type { BuildingDefinition } from '@/features/game-engine/types';

export const farm: BuildingDefinition = {
  id: 'farm',
  name: 'Fazenda',
  description: 'Produz Comida para sustentar seu povo.',
  category: 'producer',
  maxLevel: 3,
  levels: [
    {
      level: 1,
      cost: { wood: 30, stone: 10, food: 0, gold: 0 },
      buildTimeSeconds: 60,
      effects: {
        productionPerTick: { food: 0.5 },
        storageBonus: {},
      },
    },
    {
      level: 2,
      cost: { wood: 80, stone: 30, food: 0, gold: 0 },
      buildTimeSeconds: 180,
      effects: {
        productionPerTick: { food: 1.5 },
        storageBonus: {},
      },
    },
    {
      level: 3,
      cost: { wood: 200, stone: 100, food: 0, gold: 20 },
      buildTimeSeconds: 480,
      effects: {
        productionPerTick: { food: 4.0 },
        storageBonus: {},
      },
    },
  ],
};
