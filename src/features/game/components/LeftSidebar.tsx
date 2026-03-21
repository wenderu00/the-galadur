interface NavItemProps {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  soon?: boolean;
}

function NavItem({ label, icon, active, soon }: NavItemProps) {
  return (
    <div
      className={`flex items-center justify-between px-3 py-2.5 cursor-pointer transition-colors
        ${active
          ? 'bg-blue-600/20 border border-blue-600/40 text-blue-400'
          : 'text-realm-500 hover:text-realm-300 hover:bg-realm-800/50 border border-transparent'
        }`}
    >
      <div className="flex items-center gap-3">
        <span className={active ? 'text-blue-400' : 'text-realm-600'}>{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      {soon && (
        <span className="text-[10px] font-medieval tracking-widest text-realm-600 bg-realm-800 px-1.5 py-0.5">
          SOON
        </span>
      )}
    </div>
  );
}

export function LeftSidebar() {
  return (
    <aside className="w-56 flex-shrink-0 flex flex-col bg-realm-950 border-r border-realm-800">
      <div className="flex items-center gap-3 px-4 py-5 border-b border-realm-800">
        <div className="w-9 h-9 bg-white flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-realm-900" fill="currentColor">
            <path d="M3 21V9l9-6 9 6v12H3zm2-2h4v-5h6v5h4V10.1L12 5.35 5 10.1V19z" />
          </svg>
        </div>
        <div>
          <p className="font-medieval font-bold text-white text-sm leading-tight">Galadur</p>
          <p className="text-[11px] text-realm-500">Build Your Empire</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        <NavItem
          label="Cidade"
          active
          icon={
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="10" width="18" height="11" />
              <path d="M3 10L12 3l9 7" />
              <rect x="9" y="15" width="6" height="6" />
            </svg>
          }
        />
        <NavItem
          label="Exército"
          soon
          icon={
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 3L4 7v5c0 5 4 9 8 10 4-1 8-5 8-10V7L12 3z" />
            </svg>
          }
        />
        <NavItem
          label="Pesquisa"
          soon
          icon={
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
            </svg>
          }
        />
        <NavItem
          label="Configurações"
          soon
          icon={
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
          }
        />
      </nav>

      <div className="px-4 py-3 border-t border-realm-800">
        <button className="flex items-center gap-2 text-xs text-realm-600 hover:text-realm-400 transition-colors">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Recolher
        </button>
      </div>
    </aside>
  );
}
