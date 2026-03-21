import { useAtomValue, useSetAtom } from 'jotai';
import { resourcesAtom, productionAtom, gameDayAtom, gameSpeedAtom } from '@/store/gameAtoms';
import { ResourceIcon } from './ResourceIcon';
import type { ResourceKind } from '@/features/game-engine/types';
import type { GameSpeed } from '@/store/gameAtoms';

interface ResourceConfig {
  label: string;
  accent: string;
  iconBg: string;
  iconColor: string;
  barColor: string;
}

const RESOURCE_CONFIG: Record<ResourceKind, ResourceConfig> = {
  wood: {
    label: 'Madeira',
    accent: 'border-green-700',
    iconBg: 'bg-green-950',
    iconColor: 'text-green-400',
    barColor: 'bg-green-500',
  },
  stone: {
    label: 'Pedra',
    accent: 'border-slate-600',
    iconBg: 'bg-slate-900',
    iconColor: 'text-slate-400',
    barColor: 'bg-slate-500',
  },
  food: {
    label: 'Comida',
    accent: 'border-amber-700',
    iconBg: 'bg-amber-950',
    iconColor: 'text-amber-400',
    barColor: 'bg-amber-500',
  },
  gold: {
    label: 'Ouro',
    accent: 'border-yellow-700',
    iconBg: 'bg-yellow-950',
    iconColor: 'text-yellow-400',
    barColor: 'bg-yellow-500',
  },
};

const RESOURCE_ORDER: ResourceKind[] = ['wood', 'stone', 'food', 'gold'];

const SPEED_OPTIONS: GameSpeed[] = [0.5, 1, 2, 4];

function formatRate(value: number): string {
  if (value === 0) return '';
  const formatted = value % 1 === 0 ? String(value) : value.toFixed(1);
  return `+${formatted}/s`;
}

export function ResourceHUD() {
  const resources = useAtomValue(resourcesAtom);
  const production = useAtomValue(productionAtom);
  const day = useAtomValue(gameDayAtom);
  const speed = useAtomValue(gameSpeedAtom);
  const setSpeed = useSetAtom(gameSpeedAtom);

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-realm-950 border-b border-realm-800 gap-6">
      <div className="grid grid-cols-2 gap-2 flex-shrink-0">
        {RESOURCE_ORDER.map((kind) => {
          const cfg = RESOURCE_CONFIG[kind];
          const current = Math.floor(resources.current[kind]);
          const max = resources.max[kind];
          const rate = production[kind];
          const pct = Math.min(100, (current / max) * 100);

          return (
            <div
              key={kind}
              className={`flex items-center gap-3 bg-realm-900 border ${cfg.accent} px-3 py-2 min-w-[170px]`}
            >
              <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 ${cfg.iconBg} border ${cfg.accent}`}>
                <span className={cfg.iconColor}>
                  <ResourceIcon kind={kind} className="w-4 h-4" />
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-bold text-white tabular-nums">
                    {current.toLocaleString()}
                  </span>
                  <span className="text-xs text-realm-500">/ {max.toLocaleString()}</span>
                  {rate > 0 && (
                    <span className="text-xs text-sky-400 ml-auto flex-shrink-0">
                      {formatRate(rate)}
                    </span>
                  )}
                </div>
                <div className="mt-1 h-0.5 bg-realm-800 w-full">
                  <div
                    className={`h-full ${cfg.barColor} transition-all duration-1000`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 bg-realm-900 border border-realm-800 px-4 py-2">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-yellow-400" fill="currentColor">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>
          <div className="text-center">
            <p className="text-[10px] text-realm-500 uppercase tracking-widest font-medieval">Dia</p>
            <p className="text-lg font-bold text-white leading-none">{day}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setSpeed(speed === 0 ? 1 : 0)}
            className={`w-8 h-8 flex items-center justify-center border transition-colors
              ${speed === 0
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-realm-900 border-realm-700 text-realm-400 hover:border-realm-600'
              }`}
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" />
              <rect x="14" y="5" width="4" height="14" />
            </svg>
          </button>

          {SPEED_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2.5 h-8 text-xs font-semibold border transition-colors
                ${speed === s && speed !== 0
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-realm-900 border-realm-700 text-realm-400 hover:border-realm-600 hover:text-realm-300'
                }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
