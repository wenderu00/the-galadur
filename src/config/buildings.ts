/**
 * buildings.ts — Definições estáticas de todas as construções do jogo.
 *
 * Este arquivo é configuração pura: sem lógica, sem imports de engine.
 * Novas construções devem ser adicionadas aqui e em BuildingId (types.ts).
 *
 * Filosofia de balanceamento:
 * - Primeiros níveis são rápidos (< 2 min) para dar feedback imediato.
 * - Custos cruzados criam escolhas: Serraria precisa de Pedra, Mina precisa de Madeira.
 * - Produção fracionária (ex: 0.5/tick) permite curvas suaves sem saltos bruscos.
 * - Storage é controlado pelo Castelo, criando um gargalo natural de progressão.
 */

import type { BuildingDefinition, BuildingId } from '@/features/game-engine/types';

// ---------------------------------------------------------------------------
// Definições individuais
// ---------------------------------------------------------------------------

const castle: BuildingDefinition = {
  id: 'castle',
  name: 'Castelo',
  description: 'Sede do seu império. Controla os limites de armazenamento e desbloqueia novas construções.',
  category: 'headquarters',
  maxLevel: 3,
  levels: [
    {
      level: 1,
      // Castelo começa em nível 1 gratuitamente — custo zero, tempo zero.
      cost: { wood: 0, stone: 0, food: 0, gold: 0 },
      buildTimeSeconds: 0,
      effects: {
        productionPerTick: {},
        // Concede armazenamento inicial ao jogador.
        storageBonus: { wood: 200, stone: 200, food: 200, gold: 100 },
      },
    },
    {
      level: 2,
      cost: { wood: 150, stone: 200, food: 50, gold: 0 },
      buildTimeSeconds: 300, // 5 minutos
      effects: {
        productionPerTick: {},
        storageBonus: { wood: 500, stone: 500, food: 500, gold: 300 },
      },
    },
    {
      level: 3,
      cost: { wood: 500, stone: 800, food: 200, gold: 100 },
      buildTimeSeconds: 900, // 15 minutos
      effects: {
        productionPerTick: {},
        storageBonus: { wood: 1500, stone: 1500, food: 1500, gold: 1000 },
      },
    },
  ],
};

const farm: BuildingDefinition = {
  id: 'farm',
  name: 'Fazenda',
  description: 'Produz Comida para sustentar seu povo.',
  category: 'producer',
  maxLevel: 3,
  levels: [
    {
      level: 1,
      cost: { wood: 30, stone: 10, food: 0, gold: 0 },
      buildTimeSeconds: 60, // 1 minuto
      effects: {
        productionPerTick: { food: 0.5 },
        storageBonus: {},
      },
    },
    {
      level: 2,
      cost: { wood: 80, stone: 30, food: 0, gold: 0 },
      buildTimeSeconds: 180, // 3 minutos
      effects: {
        productionPerTick: { food: 1.5 },
        storageBonus: {},
      },
    },
    {
      level: 3,
      cost: { wood: 200, stone: 100, food: 0, gold: 20 },
      buildTimeSeconds: 480, // 8 minutos
      effects: {
        productionPerTick: { food: 4.0 },
        storageBonus: {},
      },
    },
  ],
};

const sawmill: BuildingDefinition = {
  id: 'sawmill',
  name: 'Serraria',
  description: 'Processa madeira das florestas ao redor.',
  category: 'producer',
  maxLevel: 3,
  levels: [
    {
      level: 1,
      // Custo em Pedra e Comida — não Madeira, para evitar catch-22 inicial.
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

const mine: BuildingDefinition = {
  id: 'mine',
  name: 'Mina',
  description: 'Extrai Pedra das montanhas próximas.',
  category: 'producer',
  maxLevel: 3,
  levels: [
    {
      level: 1,
      // Custo em Madeira — cria dependência cruzada com Serraria.
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
      buildTimeSeconds: 600, // 10 minutos
      effects: {
        productionPerTick: { stone: 3.5 },
        storageBonus: {},
      },
    },
  ],
};

const market: BuildingDefinition = {
  id: 'market',
  name: 'Mercado',
  description: 'Gera Ouro através do comércio com regiões vizinhas.',
  category: 'producer',
  maxLevel: 3,
  levels: [
    {
      level: 1,
      cost: { wood: 60, stone: 40, food: 20, gold: 0 },
      buildTimeSeconds: 120, // 2 minutos
      effects: {
        // Ouro é escasso — produção baixa intencionalmente.
        productionPerTick: { gold: 0.2 },
        storageBonus: {},
      },
    },
    {
      level: 2,
      cost: { wood: 150, stone: 120, food: 60, gold: 10 },
      buildTimeSeconds: 360, // 6 minutos
      effects: {
        productionPerTick: { gold: 0.6 },
        storageBonus: {},
      },
    },
    {
      level: 3,
      cost: { wood: 400, stone: 300, food: 150, gold: 50 },
      buildTimeSeconds: 720, // 12 minutos
      effects: {
        productionPerTick: { gold: 1.5 },
        storageBonus: {},
      },
    },
  ],
};

const barracks: BuildingDefinition = {
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
        // Sem produção por enquanto — efeitos militares serão adicionados futuramente.
        productionPerTick: {},
        storageBonus: {},
      },
    },
    {
      level: 2,
      cost: { wood: 200, stone: 180, food: 100, gold: 30 },
      buildTimeSeconds: 420, // 7 minutos
      effects: {
        productionPerTick: {},
        storageBonus: {},
      },
    },
    {
      level: 3,
      cost: { wood: 500, stone: 500, food: 300, gold: 100 },
      buildTimeSeconds: 840, // 14 minutos
      effects: {
        productionPerTick: {},
        storageBonus: {},
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Mapa central de definições
// ---------------------------------------------------------------------------

/** Todas as definições de construções indexadas por BuildingId. */
export const BUILDING_DEFINITIONS: Record<BuildingId, BuildingDefinition> = {
  castle,
  farm,
  sawmill,
  mine,
  market,
  barracks,
};

/** Array de todos os IDs de construções. Útil para iterações. */
export const ALL_BUILDING_IDS: BuildingId[] = Object.keys(
  BUILDING_DEFINITIONS,
) as BuildingId[];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Retorna a definição de um nível específico de uma construção.
 * O nível 0 não existe como definição — use o type `Exclude<BuildingLevel, 0>`.
 *
 * @example
 * getBuildingLevelDef('farm', 2) // → definição do nível 2 da Fazenda
 */
export function getBuildingLevelDef(
  id: BuildingId,
  level: Exclude<import('@/features/game-engine/types').BuildingLevel, 0>,
): import('@/features/game-engine/types').BuildingLevelDefinition {
  return BUILDING_DEFINITIONS[id].levels[level - 1];
}
