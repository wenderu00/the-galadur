import { useAtomValue } from 'jotai';
import { GameSidebar } from '../navigation/components/GameSidebar';
import { ResourceHUD } from '../resource/components/ResourceHUD';
import { BuildingGrid } from '../building/components/BuildingGrid';
import { ArmyPage } from '../army/components/ArmyPage';
import { GameSummaryPanel } from './GameSummaryPanel';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileContentArea } from './MobileContentArea';
import { activePageAtom } from '@/store/activePageAtom';

export function GameLayout() {
  const activePage = useAtomValue(activePageAtom);

  return (
    <div className="flex h-screen bg-realm-900 text-white overflow-hidden">
      <div data-testid="desktop-sidebar" className="hidden md:flex w-56 flex-shrink-0">
        <GameSidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <ResourceHUD />

        <MobileContentArea>
          {activePage === 'exercito' ? (
            <ArmyPage />
          ) : (
            <main className="flex-1 overflow-y-auto px-4 py-4 md:px-6">
              <BuildingGrid />
            </main>
          )}
        </MobileContentArea>

        <MobileBottomNav />
      </div>

      <div data-testid="desktop-summary" className="hidden md:flex w-64 flex-shrink-0">
        <GameSummaryPanel />
      </div>
    </div>
  );
}
