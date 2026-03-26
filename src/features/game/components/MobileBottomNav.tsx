import { useAtom } from 'jotai';
import { mobileTabAtom } from '@/store/mobileNavAtom';
import type { MobileTab } from '@/store/mobileNavAtom';

interface TabButtonProps {
  tab: MobileTab;
  active: boolean;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

function TabButton({ tab, active, label, icon, onClick }: TabButtonProps) {
  return (
    <button
      data-testid={`mobile-nav-tab-${tab}`}
      onClick={onClick}
      className={`flex flex-1 flex-col items-center justify-center gap-0.5 h-full transition-colors ${
        active ? 'text-gold-400' : 'text-realm-400 hover:text-realm-200'
      }`}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </button>
  );
}

export function MobileBottomNav() {
  const [activeTab, setActiveTab] = useAtom(mobileTabAtom);

  return (
    <nav data-testid="mobile-nav" className="flex md:hidden h-14 flex-shrink-0 bg-realm-950 border-t border-realm-800">
      <TabButton
        tab="buildings"
        active={activeTab === 'buildings'}
        label="Edifícios"
        onClick={() => setActiveTab('buildings')}
        icon={
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="10" width="18" height="11" />
            <path d="M3 10L12 3l9 7" />
            <rect x="9" y="15" width="6" height="6" />
          </svg>
        }
      />
      <TabButton
        tab="navigation"
        active={activeTab === 'navigation'}
        label="Navegação"
        onClick={() => setActiveTab('navigation')}
        icon={
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 3L4 7v5c0 5 4 9 8 10 4-1 8-5 8-10V7L12 3z" />
          </svg>
        }
      />
      <TabButton
        tab="summary"
        active={activeTab === 'summary'}
        label="Resumo"
        onClick={() => setActiveTab('summary')}
        icon={
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 17v-2m3 2v-4m3 4v-6M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        }
      />
    </nav>
  );
}
