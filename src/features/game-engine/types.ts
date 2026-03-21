/**
 * types.ts — Tipos centrais do domínio do jogo Galadur.
 *
 * Este arquivo é a fonte da verdade para todas as interfaces e tipos.
 * Nenhum outro arquivo de domínio deve redefinir esses tipos.
 */

// ---------------------------------------------------------------------------
// Recursos
// ---------------------------------------------------------------------------

/** Identificadores dos quatro recursos do jogo. */
export type ResourceKind = 'wood' | 'stone' | 'food' | 'gold';

/**
 * Um registro com um valor numérico para cada recurso.
 * Usado tanto para valores atuais quanto para custos, produção e limites.
 */
export interface ResourceAmount {
  wood: number;
  stone: number;
  food: number;
  gold: number;
}

/**
 * Estado completo dos recursos: valor atual (float acumulado) e
 * capacidade máxima de armazenamento.
 *
 * Nota: `current` é armazenado como float para acumular produção
 * fracionária (ex: 0.5/tick). A UI deve exibir `Math.floor(current.X)`.
 */
export interface ResourceStore {
  current: ResourceAmount;
  max: ResourceAmount;
}

// ---------------------------------------------------------------------------
// Construções
// ---------------------------------------------------------------------------

/** Identificadores de todas as construções disponíveis no jogo. */
export type BuildingId =
  | 'castle'
  | 'farm'
  | 'sawmill'
  | 'mine'
  | 'market'
  | 'barracks';

/**
 * Nível de uma construção.
 * - `0` significa não construída.
 * - `1`, `2`, `3` são os níveis ativos, cada um com efeitos crescentes.
 */
export type BuildingLevel = 0 | 1 | 2 | 3;

/** Estado atual de uma construção específica do jogador. */
export interface BuildingState {
  id: BuildingId;
  /** Nível já concluído. `0` = não construída. */
  level: BuildingLevel;
}

// ---------------------------------------------------------------------------
// Fila de construção
// ---------------------------------------------------------------------------

/**
 * Uma entrada na fila de construção/upgrade.
 * Representa uma obra em andamento.
 */
export interface BuildQueueEntry {
  buildingId: BuildingId;
  /** Nível que está sendo construído (sempre `currentLevel + 1`). */
  targetLevel: Exclude<BuildingLevel, 0>;
  /** Timestamp (ms) em que a construção foi iniciada. */
  startedAt: number;
  /** Timestamp (ms) em que a construção será concluída. */
  completesAt: number;
}

// ---------------------------------------------------------------------------
// Estado global do jogo
// ---------------------------------------------------------------------------

/**
 * Estado completo e persistido do jogo.
 * É o único objeto salvo no localStorage.
 */
export interface GameState {
  resources: ResourceStore;
  /** Mapa de todas as construções conhecidas e seus níveis atuais. */
  buildings: Record<BuildingId, BuildingState>;
  /**
   * Fila de construção. Atualmente suporta apenas 1 entrada simultânea,
   * mas a estrutura de array permite expansão futura.
   */
  buildQueue: BuildQueueEntry[];
  /** Timestamp (ms) do último tick ou ação do jogador. Usado para offline progress. */
  lastSavedAt: number;
  /** Versão do schema. Usada para migrações futuras. */
  version: number;
}

// ---------------------------------------------------------------------------
// Definições de construções (configuração estática — não persistida)
// ---------------------------------------------------------------------------

/**
 * Efeitos de um nível específico de uma construção.
 * Valores parciais: nem toda construção produz todos os recursos.
 */
export interface BuildingLevelEffects {
  /** Quantidade de cada recurso produzida por tick (1 segundo). */
  productionPerTick: Partial<ResourceAmount>;
  /**
   * Bônus de capacidade máxima de armazenamento concedido por este nível.
   * Acumulativo com outros bônus de storage.
   */
  storageBonus: Partial<ResourceAmount>;
}

/** Configuração de um único nível de uma construção. */
export interface BuildingLevelDefinition {
  level: Exclude<BuildingLevel, 0>;
  /** Custo em recursos para construir/upar para este nível. */
  cost: ResourceAmount;
  /** Tempo em segundos para completar a construção deste nível. */
  buildTimeSeconds: number;
  effects: BuildingLevelEffects;
}

/**
 * Definição estática de uma construção: todos os seus níveis,
 * nome e metadados. Nunca muda em runtime.
 */
export interface BuildingDefinition {
  id: BuildingId;
  name: string;
  description: string;
  category: 'headquarters' | 'producer' | 'military';
  /** Nível máximo atingível (atualmente 3 para todas). */
  maxLevel: 3;
  /**
   * Definições dos três níveis.
   * Índice 0 = nível 1, índice 1 = nível 2, índice 2 = nível 3.
   */
  levels: [BuildingLevelDefinition, BuildingLevelDefinition, BuildingLevelDefinition];
}

// ---------------------------------------------------------------------------
// Resultado de tentativa de construção
// ---------------------------------------------------------------------------

/** Resultado discriminado de `startConstruction`. */
export type ConstructionResult =
  | { success: true; state: GameState }
  | {
      success: false;
      error: 'queue_full' | 'max_level' | 'cannot_afford' | 'already_max_level';
    };
