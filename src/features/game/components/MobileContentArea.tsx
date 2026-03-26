import { useAtomValue } from 'jotai';
import { mobileTabAtom } from '@/store/mobileNavAtom';
import { GameSidebar } from '../navigation/components/GameSidebar';
import { GameSummaryPanel } from './GameSummaryPanel';

interface MobileContentAreaProps {
  children: React.ReactNode;
}

export function MobileContentArea({ children }: MobileContentAreaProps) {
  const activeTab = useAtomValue(mobileTabAtom);

  const buildingsVisible = activeTab === 'buildings';

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div
        className={`flex-1 flex flex-col overflow-hidden ${buildingsVisible ? '' : 'hidden md:flex'}`}
      >
        {children}
      </div>

      <div
        className={`flex-1 overflow-y-auto md:hidden ${activeTab === 'navigation' ? 'flex flex-col' : 'hidden'}`}
      >
        <GameSidebar />
      </div>

      <div
        className={`flex-1 overflow-y-auto md:hidden ${activeTab === 'summary' ? 'flex flex-col' : 'hidden'}`}
      >
        <GameSummaryPanel />
      </div>
    </div>
  );
}
