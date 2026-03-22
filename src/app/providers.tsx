import type { PropsWithChildren } from 'react';
import { Provider } from 'jotai';
import { useGameLoop } from '@/features/game-engine/hooks/useGameLoop';

function GameLoopInitializer(): null {
  useGameLoop();
  return null;
}

export function Providers({ children }: PropsWithChildren) {
  return (
    <Provider>
      <GameLoopInitializer />
      {children}
    </Provider>
  );
}
