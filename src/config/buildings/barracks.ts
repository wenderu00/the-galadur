import type { BuildingDefinition } from '@/features/game-engine/types';

export const barracks: BuildingDefinition = {
  id: 'barracks',
  name: 'Quartel',
  description: 'Treina soldados para defender e expandir o império.',
  category: 'military',
  maxLevel: 3,
  levels: [
    {
      level: 1,
      cost: { wood: 80, stone: 60, food: 30, gold: 0 },
      buildTimeSeconds: 150,
      effects: {
        productionPerTick: {},
        storageBonus: {},
      },
    },
    {
      level: 2,
      cost: { wood: 200, stone: 180, food: 100, gold: 30 },
      buildTimeSeconds: 420,
      effects: {
        productionPerTick: {},
        storageBonus: {},
      },
    },
    {
      level: 3,
      cost: { wood: 500, stone: 500, food: 300, gold: 100 },
      buildTimeSeconds: 840,
      effects: {
        productionPerTick: {},
        storageBonus: {},
      },
    },
  ],
};
