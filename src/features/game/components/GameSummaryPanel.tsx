import { ConstructionQueue } from '../construction/components/ConstructionQueue';
import { EmpireStats } from '../empire/components/EmpireStats';
import { RecentEvents } from '../empire/components/RecentEvents';
import { GameTip } from '../empire/components/GameTip';

interface GameSummaryPanelProps {
  className?: string;
}

export function GameSummaryPanel({ className = '' }: GameSummaryPanelProps) {
  return (
    <aside className={`flex flex-col w-full bg-realm-950 border-l border-realm-800 overflow-y-auto ${className}`}>
      <ConstructionQueue />
      <EmpireStats />
      <RecentEvents />
      <GameTip />
    </aside>
  );
}
