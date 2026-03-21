/**
 * gameAtoms.ts — Atoms Jotai do estado do jogo.
 *
 * Estrutura:
 * - `gameStateAtom`: atom raiz persistido no localStorage. É o único atom gravável.
 * - Atoms derivados: seletores read-only sobre fatias do gameState.
 *   Componentes subscribem apenas ao slice que precisam, evitando re-renders
 *   desnecessários.
 *
 * Regra: toda escrita passa por `gameStateAtom`. Os derivados nunca são escritos.
 */

import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import {
  createInitialGameState,
  safeParseGameState,
  GAME_STATE_VERSION,
} from '@/features/game-engine/engine';
import type {
  GameState,
  BuildingId,
  BuildingState,
  ResourceStore,
  BuildQueueEntry,
} from '@/features/game-engine/types';

// ---------------------------------------------------------------------------
// Storage customizado com validação e migração de schema
// ---------------------------------------------------------------------------

/**
 * Storage que valida o JSON ao carregar do localStorage.
 * Se o dado estiver corrompido ou com schema desatualizado,
 * descarta e usa o estado inicial.
 */
const safeGameStorage = createJSONStorage<GameState>(() => localStorage, {
  reviver: (_key: string, value: unknown) => value,
});

const STORAGE_KEY = 'galadur-state';

// ---------------------------------------------------------------------------
// Atom raiz
// ---------------------------------------------------------------------------

/**
 * Atom principal do jogo, persistido no localStorage.
 *
 * - Leitura: restaura o estado salvo (ou cria novo se não houver).
 * - Escrita: salva automaticamente via atomWithStorage.
 *
 * Uso no game loop:
 * ```ts
 * const setGameState = useSetAtom(gameStateAtom);
 * setGameState((prev) => tick(prev, Date.now()));
 * ```
 */
export const gameStateAtom = atomWithStorage<GameState>(
  STORAGE_KEY,
  createInitialGameState(),
  {
    ...safeGameStorage,
    getItem: (key, initialValue) => {
      try {
        const raw = localStorage.getItem(key);
        if (raw === null) return initialValue;

        const parsed: unknown = JSON.parse(raw);
        const validated = safeParseGameState(parsed);

        if (validated === null) {
          // Schema desatualizado ou corrompido — reset para estado inicial.
          console.warn(
            `[Galadur] Schema v${GAME_STATE_VERSION} incompatível. Resetando estado.`,
          );
          return createInitialGameState();
        }

        return validated;
      } catch {
        return initialValue;
      }
    },
  },
);

// ---------------------------------------------------------------------------
// Atoms derivados (read-only)
// ---------------------------------------------------------------------------

/**
 * Recursos atuais: valor corrente e capacidade máxima.
 * Subscribe aqui se seu componente só exibe recursos.
 */
export const resourcesAtom = atom<ResourceStore>((get) => get(gameStateAtom).resources);

/**
 * Mapa de todas as construções e seus níveis atuais.
 * Subscribe aqui se seu componente só exibe edifícios.
 */
export const buildingsAtom = atom<Record<BuildingId, BuildingState>>(
  (get) => get(gameStateAtom).buildings,
);

/**
 * Fila de construção completa.
 * Subscribe aqui se seu componente precisa de toda a fila.
 */
export const buildQueueAtom = atom<BuildQueueEntry[]>(
  (get) => get(gameStateAtom).buildQueue,
);

/**
 * Entrada ativa da fila (primeiro item) ou `null` se a fila estiver vazia.
 * Conveniência para componentes que mostram "em construção".
 */
export const activeBuildAtom = atom<BuildQueueEntry | null>(
  (get) => get(buildQueueAtom)[0] ?? null,
);

/**
 * `true` se há alguma construção em andamento.
 * Conveniência para desabilitar o botão de construção.
 */
export const isConstructingAtom = atom<boolean>(
  (get) => get(buildQueueAtom).length > 0,
);

/**
 * Timestamp do último save (ms).
 * Útil para debug e para exibir "último online há X min".
 */
export const lastSavedAtAtom = atom<number>((get) => get(gameStateAtom).lastSavedAt);
