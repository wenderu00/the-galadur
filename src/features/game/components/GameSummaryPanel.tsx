import { ConstructionQueue } from '../construction/components/ConstructionQueue';
import { EmpireStats } from '../empire/components/EmpireStats';
import { RecentEvents } from '../empire/components/RecentEvents';
import { GameTip } from '../empire/components/GameTip';

export function GameSummaryPanel() {
  return (
    <aside className="w-64 flex-shrink-0 flex flex-col bg-realm-950 border-l border-realm-800 overflow-y-auto">
      <ConstructionQueue />
      <EmpireStats />
      <RecentEvents />
      <GameTip />
    </aside>
  );
}
