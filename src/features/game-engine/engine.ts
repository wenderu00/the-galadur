/**
 * engine.ts — Motor do jogo Galadur.
 *
 * Módulo puramente funcional: sem React, sem Jotai, sem efeitos colaterais.
 * Todas as funções recebem estado e retornam novo estado (imutabilidade).
 * `now` é sempre passado como parâmetro para facilitar testes unitários.
 */

import {
  BUILDING_DEFINITIONS,
  ALL_BUILDING_IDS,
  getBuildingLevelDef,
} from '@/config/buildings';
import type {
  GameState,
  ResourceAmount,
  ResourceKind,
  ResourceStore,
  BuildingId,
  BuildingState,
  BuildingLevel,
  BuildQueueEntry,
  ConstructionResult,
} from './types';

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

export const RESOURCE_KINDS: ResourceKind[] = ['wood', 'stone', 'food', 'gold'];

/** Versão atual do schema do GameState. Incrementar ao mudar a estrutura. */
export const GAME_STATE_VERSION = 1;

/**
 * Limite máximo de ticks simulados offline (8 horas).
 * Evita cálculos absurdamente longos se o jogador ficar dias ausente.
 */
export const MAX_OFFLINE_SECONDS = 8 * 60 * 60; // 28.800 segundos

// ---------------------------------------------------------------------------
// Helpers de ResourceAmount
// ---------------------------------------------------------------------------

/** Cria um ResourceAmount zerado. */
function zeroAmount(): ResourceAmount {
  return { wood: 0, stone: 0, food: 0, gold: 0 };
}

/**
 * Soma dois ResourceAmount.
 * Retorna um novo objeto sem modificar os originais.
 */
function addAmounts(a: ResourceAmount, b: Partial<ResourceAmount>): ResourceAmount {
  return {
    wood: a.wood + (b.wood ?? 0),
    stone: a.stone + (b.stone ?? 0),
    food: a.food + (b.food ?? 0),
    gold: a.gold + (b.gold ?? 0),
  };
}

/**
 * Subtrai `b` de `a`. Não valida se o resultado é negativo —
 * chame `canAfford` antes de usar.
 */
function subtractAmounts(a: ResourceAmount, b: ResourceAmount): ResourceAmount {
  return {
    wood: a.wood - b.wood,
    stone: a.stone - b.stone,
    food: a.food - b.food,
    gold: a.gold - b.gold,
  };
}

/** Limita cada valor de `amount` ao máximo correspondente em `cap`. */
function clampToMax(amount: ResourceAmount, cap: ResourceAmount): ResourceAmount {
  return {
    wood: Math.min(amount.wood, cap.wood),
    stone: Math.min(amount.stone, cap.stone),
    food: Math.min(amount.food, cap.food),
    gold: Math.min(amount.gold, cap.gold),
  };
}

// ---------------------------------------------------------------------------
// Cálculos de estado
// ---------------------------------------------------------------------------

/**
 * Calcula a produção total por tick com base nos níveis atuais das construções.
 * Soma os `productionPerTick` de cada construção no seu nível atual.
 */
export function calculateProduction(
  buildings: Record<BuildingId, BuildingState>,
): ResourceAmount {
  return ALL_BUILDING_IDS.reduce<ResourceAmount>((total, id) => {
    const { level } = buildings[id];
    if (level === 0) return total;

    const def = getBuildingLevelDef(id, level as Exclude<BuildingLevel, 0>);
    return addAmounts(total, def.effects.productionPerTick);
  }, zeroAmount());
}

/**
 * Calcula a capacidade máxima de armazenamento somando todos os
 * `storageBonus` das construções no seu nível atual.
 *
 * Nota: o bônus de nível 2 **substitui** o de nível 1 (não é aditivo).
 * O efeito real de armazenamento de uma construção é sempre o do nível atual.
 */
export function calculateStorageCaps(
  buildings: Record<BuildingId, BuildingState>,
): ResourceAmount {
  return ALL_BUILDING_IDS.reduce<ResourceAmount>((total, id) => {
    const { level } = buildings[id];
    if (level === 0) return total;

    const def = getBuildingLevelDef(id, level as Exclude<BuildingLevel, 0>);
    return addAmounts(total, def.effects.storageBonus);
  }, zeroAmount());
}

// ---------------------------------------------------------------------------
// Estado inicial
// ---------------------------------------------------------------------------

/**
 * Cria um GameState novo do zero.
 * - Castelo começa em nível 1 (sem custo, concedido ao jogador).
 * - Todos os outros edifícios começam em nível 0 (não construídos).
 * - Recursos começam zerados, mas com a capacidade máxima do Castelo nível 1.
 */
export function createInitialGameState(now: number = Date.now()): GameState {
  // Monta o mapa de construções com Castelo em 1 e o resto em 0.
  const buildings = ALL_BUILDING_IDS.reduce<Record<BuildingId, BuildingState>>(
    (acc, id) => {
      acc[id] = { id, level: id === 'castle' ? 1 : 0 };
      return acc;
    },
    {} as Record<BuildingId, BuildingState>,
  );

  const maxStorage = calculateStorageCaps(buildings);

  // Começa com 50 de cada recurso para o jogador poder construir imediatamente.
  const initialResources: ResourceStore = {
    current: { wood: 50, stone: 30, food: 20, gold: 0 },
    max: maxStorage,
  };

  return {
    resources: initialResources,
    buildings,
    buildQueue: [],
    lastSavedAt: now,
    version: GAME_STATE_VERSION,
  };
}

// ---------------------------------------------------------------------------
// Verificação de recursos
// ---------------------------------------------------------------------------

/**
 * Retorna `true` se `current` possui pelo menos os valores de `cost`
 * em todos os recursos.
 */
export function canAfford(current: ResourceAmount, cost: ResourceAmount): boolean {
  return RESOURCE_KINDS.every((kind) => current[kind] >= cost[kind]);
}

/**
 * Deduz `cost` de `current`. Sempre chame `canAfford` antes.
 * Garante que nenhum valor ficará negativo (clamp em 0).
 */
export function deductCost(current: ResourceAmount, cost: ResourceAmount): ResourceAmount {
  const result = subtractAmounts(current, cost);
  // Segurança: nunca deixar negativo por imprecisão de float.
  return {
    wood: Math.max(0, result.wood),
    stone: Math.max(0, result.stone),
    food: Math.max(0, result.food),
    gold: Math.max(0, result.gold),
  };
}

// ---------------------------------------------------------------------------
// Início de construção
// ---------------------------------------------------------------------------

/**
 * Tenta iniciar a construção ou upgrade de um edifício.
 *
 * Validações (em ordem):
 * 1. A fila de construção está vazia (apenas uma obra por vez).
 * 2. O edifício não está no nível máximo.
 * 3. O jogador pode pagar o custo.
 *
 * Em caso de sucesso, deduz os recursos e adiciona uma entrada na fila.
 * Retorna um resultado discriminado para tratamento explícito de erros.
 */
export function startConstruction(
  state: GameState,
  buildingId: BuildingId,
  now: number,
): ConstructionResult {
  if (state.buildQueue.length > 0) {
    return { success: false, error: 'queue_full' };
  }

  const building = state.buildings[buildingId];
  const targetLevel = (building.level + 1) as BuildingLevel;

  if (building.level >= 3) {
    return { success: false, error: 'already_max_level' };
  }

  if (targetLevel > BUILDING_DEFINITIONS[buildingId].maxLevel) {
    return { success: false, error: 'max_level' };
  }

  const levelDef = getBuildingLevelDef(
    buildingId,
    targetLevel as Exclude<BuildingLevel, 0>,
  );

  if (!canAfford(state.resources.current, levelDef.cost)) {
    return { success: false, error: 'cannot_afford' };
  }

  const entry: BuildQueueEntry = {
    buildingId,
    targetLevel: targetLevel as Exclude<BuildingLevel, 0>,
    startedAt: now,
    completesAt: now + levelDef.buildTimeSeconds * 1000,
  };

  const newState: GameState = {
    ...state,
    resources: {
      ...state.resources,
      current: deductCost(state.resources.current, levelDef.cost),
    },
    buildQueue: [...state.buildQueue, entry],
    lastSavedAt: now,
  };

  return { success: true, state: newState };
}

// ---------------------------------------------------------------------------
// Processamento da fila de construção
// ---------------------------------------------------------------------------

/**
 * Verifica se há construções concluídas na fila e aplica seus efeitos.
 *
 * Para cada entrada onde `completesAt <= now`:
 * 1. Incrementa o nível do edifício.
 * 2. Recalcula a capacidade de armazenamento (pode ter aumentado).
 * 3. Remove a entrada da fila.
 *
 * Processa em ordem de `completesAt` para garantir que edifícios concluídos
 * mais cedo sejam aplicados antes (relevante para o cálculo offline).
 */
export function processCompletedBuildings(state: GameState, now: number): GameState {
  const completedEntries = state.buildQueue
    .filter((entry) => entry.completesAt <= now)
    .sort((a, b) => a.completesAt - b.completesAt);

  if (completedEntries.length === 0) return state;

  let buildings = { ...state.buildings };

  for (const entry of completedEntries) {
    buildings = {
      ...buildings,
      [entry.buildingId]: {
        ...buildings[entry.buildingId],
        level: entry.targetLevel,
      },
    };
  }

  const completedIds = new Set(completedEntries.map((e) => e.buildingId));
  const remainingQueue = state.buildQueue.filter(
    (entry) => !completedIds.has(entry.buildingId) || entry.completesAt > now,
  );

  // Recalcula o storage máximo com os novos níveis.
  const newMaxStorage = calculateStorageCaps(buildings);

  return {
    ...state,
    buildings,
    buildQueue: remainingQueue,
    resources: {
      current: clampToMax(state.resources.current, newMaxStorage),
      max: newMaxStorage,
    },
  };
}

// ---------------------------------------------------------------------------
// Tick do game loop
// ---------------------------------------------------------------------------

/**
 * Aplica um único tick de produção de recursos.
 *
 * 1. Calcula produção com base nos edifícios atuais.
 * 2. Adiciona ao `current`, respeitando o `max`.
 * 3. Atualiza `lastSavedAt`.
 *
 * Chamar `processCompletedBuildings` antes do tick garante que
 * edifícios concluídos neste tick já contribuam com produção.
 */
export function applyProductionTick(state: GameState, now: number): GameState {
  const production = calculateProduction(state.buildings);
  const newCurrent = clampToMax(
    addAmounts(state.resources.current, production),
    state.resources.max,
  );

  return {
    ...state,
    resources: {
      ...state.resources,
      current: newCurrent,
    },
    lastSavedAt: now,
  };
}

/**
 * Função principal do game loop.
 * Compõe: processCompletedBuildings → applyProductionTick.
 * Chamada a cada segundo pelo `useGameLoop`.
 */
export function tick(state: GameState, now: number): GameState {
  const afterCompletions = processCompletedBuildings(state, now);
  return applyProductionTick(afterCompletions, now);
}

// ---------------------------------------------------------------------------
// Progresso offline
// ---------------------------------------------------------------------------

/**
 * Calcula e aplica o progresso que ocorreu enquanto o jogador estava offline.
 *
 * Estratégia de simulação eficiente (sem loop de 28.800 iterações):
 *
 * Em vez de simular cada tick individualmente, divide o tempo offline
 * em segmentos delimitados pelas conclusões de construções na fila.
 * Para cada segmento:
 *   - Produção = segundos_no_segmento × produção_por_tick
 *   - Ao final do segmento, aplica o nível do edifício concluído.
 *
 * Isso garante que produção pós-upgrade seja corretamente calculada
 * com a taxa do novo nível.
 *
 * @param state  Estado do jogo no momento do último save.
 * @param now    Timestamp atual (ms).
 */
export function calculateOfflineProgress(state: GameState, now: number): GameState {
  const elapsedSeconds = Math.floor((now - state.lastSavedAt) / 1000);

  if (elapsedSeconds <= 0) return state;

  const cappedSeconds = Math.min(elapsedSeconds, MAX_OFFLINE_SECONDS);
  const simulationEnd = state.lastSavedAt + cappedSeconds * 1000;

  // Ordena a fila por tempo de conclusão para processar em ordem.
  const sortedQueue = [...state.buildQueue].sort(
    (a, b) => a.completesAt - b.completesAt,
  );

  let currentState = state;
  let cursor = state.lastSavedAt; // timestamp ms do início do segmento atual

  for (const entry of sortedQueue) {
    if (entry.completesAt > simulationEnd) break; // conclusão após o período offline

    const segmentSeconds = Math.max(0, Math.floor((entry.completesAt - cursor) / 1000));

    // Aplica produção do segmento antes da conclusão do edifício.
    if (segmentSeconds > 0) {
      const production = calculateProduction(currentState.buildings);
      const gained = scaleAmount(production, segmentSeconds);
      const newCurrent = clampToMax(
        addAmounts(currentState.resources.current, gained),
        currentState.resources.max,
      );
      currentState = {
        ...currentState,
        resources: { ...currentState.resources, current: newCurrent },
      };
    }

    // Conclui o edifício neste ponto do tempo.
    currentState = processCompletedBuildings(currentState, entry.completesAt);
    cursor = entry.completesAt;
  }

  // Aplica produção do segmento final (do último evento até o fim da simulação).
  const remainingSeconds = Math.max(0, Math.floor((simulationEnd - cursor) / 1000));
  if (remainingSeconds > 0) {
    const production = calculateProduction(currentState.buildings);
    const gained = scaleAmount(production, remainingSeconds);
    const newCurrent = clampToMax(
      addAmounts(currentState.resources.current, gained),
      currentState.resources.max,
    );
    currentState = {
      ...currentState,
      resources: { ...currentState.resources, current: newCurrent },
    };
  }

  return {
    ...currentState,
    lastSavedAt: now,
  };
}

/** Multiplica todos os valores de um ResourceAmount por um escalar. */
function scaleAmount(amount: ResourceAmount, multiplier: number): ResourceAmount {
  return {
    wood: amount.wood * multiplier,
    stone: amount.stone * multiplier,
    food: amount.food * multiplier,
    gold: amount.gold * multiplier,
  };
}

// ---------------------------------------------------------------------------
// Migração de schema (para uso futuro)
// ---------------------------------------------------------------------------

/**
 * Tenta fazer parse seguro de um GameState do localStorage.
 * Se a versão do schema for diferente ou o dado for inválido,
 * retorna `null` para que o chamador possa criar um estado inicial limpo.
 */
export function safeParseGameState(raw: unknown): GameState | null {
  if (typeof raw !== 'object' || raw === null) return null;

  const candidate = raw as Record<string, unknown>;

  if (candidate['version'] !== GAME_STATE_VERSION) return null;

  // Validação mínima de estrutura.
  if (
    typeof candidate['resources'] !== 'object' ||
    typeof candidate['buildings'] !== 'object' ||
    !Array.isArray(candidate['buildQueue']) ||
    typeof candidate['lastSavedAt'] !== 'number'
  ) {
    return null;
  }

  return raw as GameState;
}
