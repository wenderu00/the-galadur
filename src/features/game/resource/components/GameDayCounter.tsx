import { Sun } from 'lucide-react';
import { formatNumber } from '@/lib/format';

interface GameDayCounterProps {
  day: number;
}

export function GameDayCounter({ day }: GameDayCounterProps) {
  return (
    <p className="flex items-center gap-2">
      <Sun aria-hidden="true" className="size-5 text-accent-text" />
      <span className="font-mono text-mono-xs tracking-kicker text-ink-muted uppercase">Dia</span>
      <span data-testid="game-day-value" className="font-display text-display-sm font-extrabold">
        {formatNumber(day)}
      </span>
    </p>
  );
}
