import { LeftSidebar } from './LeftSidebar';
import { ResourceHUD } from './ResourceHUD';
import { BuildingGrid } from './BuildingGrid';
import { RightPanel } from './RightPanel';

export function GameLayout() {
  return (
    <div className="flex h-screen bg-realm-900 text-white overflow-hidden">
      <LeftSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <ResourceHUD />
        <main className="flex-1 overflow-y-auto p-6">
          <BuildingGrid />
        </main>
      </div>

      <RightPanel />
    </div>
  );
}
