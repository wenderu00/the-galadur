import type { PropsWithChildren } from 'react';
import { Provider } from 'jotai';
import { useGameLoop } from '@/features/game-engine/hooks/useGameLoop';

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
