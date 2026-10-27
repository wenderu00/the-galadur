import { Providers } from '@/app/providers';
import { GameLayout } from './components/GameLayout';

export function GamePage() {
  return (
    <Providers>
      <GameLayout />
    </Providers>
  );
}
