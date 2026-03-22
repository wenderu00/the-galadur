import { GameSidebar } from '../navigation/components/GameSidebar';
import { ResourceHUD } from '../resource/components/ResourceHUD';
import { BuildingGrid } from '../building/components/BuildingGrid';
import { GameSummaryPanel } from './GameSummaryPanel';

export function GameLayout() {
  return (
    <div className="flex h-screen bg-realm-900 text-white overflow-hidden">
      <GameSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <ResourceHUD />
        <main className="flex-1 overflow-y-auto px-6 py-4">
          <BuildingGrid />
        </main>
      </div>

      <GameSummaryPanel />
    </div>
  );
}
