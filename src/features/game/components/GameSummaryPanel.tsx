import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ConstructionQueue } from '../construction/components/ConstructionQueue';
import { EmpireStats } from '../empire/components/EmpireStats';
import { GameTip } from '../empire/components/GameTip';
import { RecentEvents } from '../empire/components/RecentEvents';

export function GameSummaryPanel() {
  return (
    <div className="flex flex-col gap-8">
      <ConstructionQueue />
      <EmpireStats />
      <RecentEvents />
      <GameTip />
      <ThemeToggle />
    </div>
  );
}
