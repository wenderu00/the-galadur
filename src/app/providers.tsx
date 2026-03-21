/**
 * providers.tsx — Providers globais da aplicação.
 *
 * Ordem dos providers:
 * 1. `<Provider>` do Jotai — contexto de todos os atoms.
 * 2. `<GameLoopInitializer>` — inicia o game loop dentro do Provider
 *    (precisa estar dentro para ter acesso aos atoms).
 *
 * Novos providers (tema, router, etc.) devem ser adicionados aqui.
 */

import type { PropsWithChildren } from 'react';
import { Provider } from 'jotai';
import { useGameLoop } from '@/features/game-engine/hooks/useGameLoop';

/**
 * Componente sem renderização que inicializa o game loop.
 * Existe como componente separado porque hooks só podem ser chamados
 * dentro do contexto do Provider Jotai — não dentro do próprio Provider.
 */
function GameLoopInitializer(): null {
  useGameLoop();
  return null;
}

interface ProvidersProps extends PropsWithChildren {}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider>
      <GameLoopInitializer />
      {children}
    </Provider>
  );
}
