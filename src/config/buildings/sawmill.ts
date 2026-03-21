import type { BuildingDefinition } from '@/features/game-engine/types';

export const sawmill: BuildingDefinition = {
  id: 'sawmill',
  name: 'Serraria',
  description: 'Processa madeira das florestas ao redor.',
  category: 'producer',
  maxLevel: 3,
  levels: [
    {
      level: 1,
      cost: { wood: 0, stone: 15, food: 5, gold: 0 },
      buildTimeSeconds: 60,
      effects: {
        productionPerTick: { wood: 0.5 },
        storageBonus: {},
      },
    },
    {
      level: 2,
      cost: { wood: 60, stone: 50, food: 15, gold: 0 },
      buildTimeSeconds: 200,
      effects: {
        productionPerTick: { wood: 1.5 },
        storageBonus: {},
      },
    },
    {
      level: 3,
      cost: { wood: 150, stone: 150, food: 50, gold: 30 },
      buildTimeSeconds: 500,
      effects: {
        productionPerTick: { wood: 4.0 },
        storageBonus: {},
      },
    },
  ],
};
