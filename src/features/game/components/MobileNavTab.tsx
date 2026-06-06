import type { MobileTab } from '@/store/mobileNavAtom';

interface MobileNavTabProps {
  tab: MobileTab;
  active: boolean;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export function MobileNavTab({ tab, active, label, icon, onClick }: MobileNavTabProps) {
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
