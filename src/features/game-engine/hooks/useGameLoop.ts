/**
 * useGameLoop.ts — Hook que inicializa e mantém o game loop em execução.
 *
 * Responsabilidades:
 * 1. Ao montar: calcular progresso offline e aplicar ao estado.
 * 2. Em seguida: rodar um tick por segundo via setInterval.
 * 3. Ao desmontar: limpar o intervalo (cleanup automático do useEffect).
 *
 * Este hook não retorna nada — é puro efeito colateral.
 * Deve ser chamado uma única vez, dentro do Provider Jotai,
 * via o componente `GameLoopInitializer` em `providers.tsx`.
 */

import { useEffect, useRef } from 'react';
import { useSetAtom } from 'jotai';
import { gameStateAtom } from '@/store/gameAtoms';
import { tick, calculateOfflineProgress } from '@/features/game-engine/engine';

/** Intervalo do game loop em milissegundos (1 tick por segundo). */
const TICK_INTERVAL_MS = 1_000;

export function useGameLoop(): void {
  const setGameState = useSetAtom(gameStateAtom);

  /**
   * Ref para garantir que o progresso offline seja aplicado exatamente uma vez,
   * mesmo em React 18 StrictMode (que desmonta/remonta componentes em dev).
   * Refs persistem entre o ciclo de desmonte/remonte do StrictMode.
   */
  const offlineAppliedRef = useRef(false);

  // --- Fase 1: Progresso offline (executa uma vez na montagem) ---
  useEffect(() => {
    if (offlineAppliedRef.current) return;
    offlineAppliedRef.current = true;

    const now = Date.now();
    setGameState((prev) => calculateOfflineProgress(prev, now));
  }, [setGameState]);

  // --- Fase 2: Loop em tempo real ---
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Usa o padrão de updater (prev => ...) para nunca operar
      // sobre um estado stale — Jotai garante o valor mais recente.
      setGameState((prev) => tick(prev, Date.now()));
    }, TICK_INTERVAL_MS);

    // Cleanup: cancela o intervalo quando o componente desmontar.
    return () => clearInterval(intervalId);
  }, [setGameState]);
}
