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
        productionPerTick: { wood: 0.5, stone: 0.3, food: 0.3 },
        storageBonus: { wood: 200, stone: 200, food: 200, gold: 100 },
      },
    },
    {
      level: 2,
      cost: { wood: 40, stone: 50, food: 15, gold: 0 },
      buildTimeSeconds: 45,
      effects: {
        productionPerTick: { wood: 1, stone: 0.6, food: 0.6, gold: 0.1 },
        storageBonus: { wood: 500, stone: 500, food: 500, gold: 300 },
      },
    },
    {
      level: 3,
      cost: { wood: 120, stone: 180, food: 60, gold: 15 },
      buildTimeSeconds: 240,
      effects: {
        productionPerTick: { wood: 2, stone: 1.2, food: 1.2, gold: 0.3 },
        storageBonus: { wood: 1500, stone: 1500, food: 1500, gold: 1000 },
      },
    },
  ],
};
