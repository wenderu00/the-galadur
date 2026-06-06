import { useAtom } from 'jotai';
import { mobileTabAtom } from '@/store/mobileNavAtom';
import { MobileNavTab } from './MobileNavTab';
import { BuildingsTabIcon, NavigationTabIcon, SummaryTabIcon } from './mobileNavConfig';

export function MobileBottomNav() {
  const [activeTab, setActiveTab] = useAtom(mobileTabAtom);

  return (
    <nav
      data-testid="mobile-nav"
      className="flex md:hidden h-14 flex-shrink-0 bg-realm-950 border-t border-realm-800"
    >
      <MobileNavTab
        tab="buildings"
        active={activeTab === 'buildings'}
        label="Edifícios"
        onClick={() => setActiveTab('buildings')}
        icon={BuildingsTabIcon}
      />
      <MobileNavTab
        tab="navigation"
        active={activeTab === 'navigation'}
        label="Navegação"
        onClick={() => setActiveTab('navigation')}
        icon={NavigationTabIcon}
      />
      <MobileNavTab
        tab="summary"
        active={activeTab === 'summary'}
        label="Resumo"
        onClick={() => setActiveTab('summary')}
        icon={SummaryTabIcon}
      />
    </nav>
  );
}
