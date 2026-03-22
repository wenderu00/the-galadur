import type { ReactNode } from 'react';

interface GameNavItemProps {
  label: string;
  icon: ReactNode;
  active?: boolean;
  soon?: boolean;
}

export function GameNavItem({ label, icon, active, soon }: GameNavItemProps) {
  return (
    <li
      className={`flex items-center justify-between px-3 py-2.5 cursor-pointer transition-colors ${
        active
          ? 'bg-blue-600/20 border border-blue-600/40 text-blue-400'
          : 'text-realm-400 hover:text-white hover:bg-realm-800/50 border border-transparent'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={active ? 'text-blue-400' : 'text-realm-400'}>{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      {soon && (
        <span className="text-[10px] font-medieval tracking-widest text-realm-400 bg-realm-800 px-1.5 py-0.5">
          SOON
        </span>
      )}
    </li>
  );
}
