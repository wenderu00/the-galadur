import type { BuildingDefinition } from '@/features/game-engine/types';

export const prefeitura: BuildingDefinition = {
  id: 'prefeitura',
  name: 'Prefeitura',
  description: 'Centro administrativo do império. Coordena as obras e reduz o tempo de construção de todas as edificações.',
  category: 'headquarters',
  maxLevel: 3,
  levels: [
    {
      level: 1,
      cost: { wood: 30, stone: 25, food: 10, gold: 0 },
      buildTimeSeconds: 40,
      effects: {
        productionPerTick: {},
        storageBonus: {},
        constructionSpeedBonus: 0.15,
      },
    },
    {
      level: 2,
      cost: { wood: 90, stone: 70, food: 25, gold: 5 },
      buildTimeSeconds: 120,
      effects: {
        productionPerTick: {},
        storageBonus: {},
        constructionSpeedBonus: 0.30,
      },
    },
    {
      level: 3,
      cost: { wood: 250, stone: 200, food: 60, gold: 25 },
      buildTimeSeconds: 360,
      effects: {
        productionPerTick: {},
        storageBonus: {},
        constructionSpeedBonus: 0.50,
      },
    },
  ],
};
