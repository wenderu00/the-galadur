import type { BuildingDefinition } from '@/features/game-engine/types';

export const castle: BuildingDefinition = {
  id: 'castle',
  name: 'Castelo',
  description: 'Sede do seu império. Controla os limites de armazenamento e desbloqueia novas construções.',
  category: 'headquarters',
  maxLevel: 3,
  levels: [
    {
      level: 1,
      cost: { wood: 0, stone: 0, food: 0, gold: 0 },
      buildTimeSeconds: 0,
      effects: {
        productionPerTick: {},
        storageBonus: { wood: 200, stone: 200, food: 200, gold: 100 },
      },
    },
    {
      level: 2,
      cost: { wood: 150, stone: 200, food: 50, gold: 0 },
      buildTimeSeconds: 300,
      effects: {
        productionPerTick: {},
        storageBonus: { wood: 500, stone: 500, food: 500, gold: 300 },
      },
    },
    {
      level: 3,
      cost: { wood: 500, stone: 800, food: 200, gold: 100 },
      buildTimeSeconds: 900,
      effects: {
        productionPerTick: {},
        storageBonus: { wood: 1500, stone: 1500, food: 1500, gold: 1000 },
      },
    },
  ],
};
