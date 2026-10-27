import { useAtomValue } from 'jotai';
import {
  AppShell,
  AppShellAside,
  AppShellBody,
  AppShellHeader,
  AppShellMain,
  AppShellNav,
  AppShellNavItem,
  AppShellSidebar,
} from '@/components/ui/app-shell';
import { Badge } from '@/components/ui/badge';
import { activePageAtom } from '@/store/activePageAtom';
import { ArmyPage } from '../army/ArmyPage';
import { BuildingGrid } from '../building/BuildingGrid';
import { GameBrand } from '../navigation/components/GameBrand';
import { useGameNavigation } from '../navigation/hooks/useGameNavigation';
import { ResourceHUD } from '../resource/components/ResourceHUD';
import { GameSummaryPanel } from './GameSummaryPanel';

export function GameLayout() {
  const activePage = useAtomValue(activePageAtom);
  const navigation = useGameNavigation();

  return (
    <AppShell mobileNav="bottom" sidebarBreakpoint="md">
      <AppShellSidebar data-testid="desktop-sidebar" brand={<GameBrand />}>
        <AppShellNav>
          {navigation.map((item) => (
            <AppShellNavItem
              key={item.label}
              asChild
              label={item.label}
              icon={item.icon}
              active={item.active}
              badge={item.soon ? <Badge>em breve</Badge> : undefined}
            >
              <button type="button" disabled={item.soon} onClick={item.onSelect} />
            </AppShellNavItem>
          ))}
        </AppShellNav>
      </AppShellSidebar>
      <AppShellBody>
        <AppShellHeader data-testid="game-hud">
          <ResourceHUD />
        </AppShellHeader>
        <AppShellMain key={activePage} className="motion-safe:animate-mw-fade-in">
          {activePage === 'exercito' ? <ArmyPage /> : <BuildingGrid />}
        </AppShellMain>
        <AppShellAside aria-label="Resumo do império" data-testid="summary-panel">
          <GameSummaryPanel />
        </AppShellAside>
      </AppShellBody>
    </AppShell>
  );
}
