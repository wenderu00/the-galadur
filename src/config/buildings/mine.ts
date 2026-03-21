import type { BuildingDefinition } from '@/features/game-engine/types';

export const mine: BuildingDefinition = {
  id: 'mine',
  name: 'Mina',
  description: 'Extrai Pedra das montanhas próximas.',
  category: 'producer',
  maxLevel: 3,
  levels: [
    {
      level: 1,
      cost: { wood: 40, stone: 0, food: 10, gold: 0 },
      buildTimeSeconds: 90,
      effects: {
        productionPerTick: { stone: 0.4 },
        storageBonus: {},
      },
    },
    {
      level: 2,
      cost: { wood: 100, stone: 20, food: 30, gold: 0 },
      buildTimeSeconds: 240,
      effects: {
        productionPerTick: { stone: 1.2 },
        storageBonus: {},
      },
    },
    {
      level: 3,
      cost: { wood: 250, stone: 60, food: 80, gold: 50 },
      buildTimeSeconds: 600,
      effects: {
        productionPerTick: { stone: 3.5 },
        storageBonus: {},
      },
    },
  ],
};
