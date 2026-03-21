import { Providers } from '@/app/providers';
import { GameLayout } from '@/features/game/components/GameLayout';

export function App() {
  return (
    <Providers>
      <GameLayout />
    </Providers>
  );
}
