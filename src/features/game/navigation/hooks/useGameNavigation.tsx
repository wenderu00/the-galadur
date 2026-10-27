import type { ReactNode } from 'react';
import { useAtom } from 'jotai';
import { Castle, FlaskConical, Settings, Swords } from 'lucide-react';
import { activePageAtom, type ActivePage } from '@/store/activePageAtom';

export interface GameNavigationItem {
  label: string;
  icon: ReactNode;
  active: boolean;
  soon: boolean;
  onSelect?: () => void;
}

export function useGameNavigation(): GameNavigationItem[] {
  const [activePage, setActivePage] = useAtom(activePageAtom);

  function pageItem(page: ActivePage, label: string, icon: ReactNode): GameNavigationItem {
    return {
      label,
      icon,
      active: activePage === page,
      soon: false,
      onSelect: () => setActivePage(page),
    };
  }

  return [
    pageItem('cidade', 'cidade', <Castle aria-hidden="true" />),
    pageItem('exercito', 'exército', <Swords aria-hidden="true" />),
    { label: 'pesquisa', icon: <FlaskConical aria-hidden="true" />, active: false, soon: true },
    { label: 'configurações', icon: <Settings aria-hidden="true" />, active: false, soon: true },
  ];
}
