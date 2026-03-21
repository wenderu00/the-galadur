import type { BuildingDefinition } from '@/features/game-engine/types';

export const market: BuildingDefinition = {
  id: 'market',
  name: 'Mercado',
  description: 'Gera Ouro através do comércio com regiões vizinhas.',
  category: 'producer',
  maxLevel: 3,
  levels: [
    {
      level: 1,
      cost: { wood: 60, stone: 40, food: 20, gold: 0 },
      buildTimeSeconds: 120,
      effects: {
        productionPerTick: { gold: 0.2 },
        storageBonus: {},
      },
    },
    {
      level: 2,
      cost: { wood: 150, stone: 120, food: 60, gold: 10 },
      buildTimeSeconds: 360,
      effects: {
        productionPerTick: { gold: 0.6 },
        storageBonus: {},
      },
    },
    {
      level: 3,
      cost: { wood: 400, stone: 300, food: 150, gold: 50 },
      buildTimeSeconds: 720,
      effects: {
        productionPerTick: { gold: 1.5 },
        storageBonus: {},
      },
    },
  ],
};
