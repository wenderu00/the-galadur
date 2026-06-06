import { Button } from '@/components/ui/button';
import { GameNavItem } from './GameNavItem';
import { CityIcon, ArmyIcon, ResearchIcon, SettingsIcon } from './sidebarNavConfig';

interface GameSidebarProps {
  className?: string;
}

export function GameSidebar({ className = '' }: GameSidebarProps) {
  return (
    <aside className={`flex flex-col w-full bg-realm-950 border-r border-realm-800 ${className}`}>
      <div className="flex items-center gap-3 px-4 py-5 border-b border-realm-800">
        <div className="w-9 h-9 bg-white flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-realm-900" fill="currentColor">
            <path d="M3 21V9l9-6 9 6v12H3zm2-2h4v-5h6v5h4V10.1L12 5.35 5 10.1V19z" />
          </svg>
        </div>
        <div>
          <p className="font-medieval font-bold text-white text-sm leading-tight">Galadur</p>
          <p className="text-xs text-realm-400">Build Your Empire</p>
        </div>
      </div>
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          <GameNavItem label="Cidade" active icon={CityIcon} />
          <GameNavItem label="Exército" soon icon={ArmyIcon} />
          <GameNavItem label="Pesquisa" soon icon={ResearchIcon} />
          <GameNavItem label="Configurações" soon icon={SettingsIcon} />
        </ul>
      </nav>
      <div className="px-4 py-3 border-t border-realm-800">
        <Button
          variant="ghost"
          className="h-auto p-0 rounded-none text-xs text-realm-600 hover:text-realm-400 hover:bg-transparent gap-2"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Recolher
        </Button>
      </div>
    </aside>
  );
}
