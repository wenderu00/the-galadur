import { ResourceIcon } from '@/features/game/components/ResourceIcon';
import { RESOURCE_CONFIG } from './resourceConfig';
import type { ResourceKind } from '@/features/game-engine/types';

function formatRate(value: number): string {
  if (value === 0) return '';
  const formatted = value % 1 === 0 ? String(value) : value.toFixed(1);
  return `+${formatted}/s`;
}

interface ResourceBarProps {
  kind: ResourceKind;
  current: number;
  max: number;
  rate: number;
}

export function ResourceBar({ kind, current, max, rate }: ResourceBarProps) {
  const cfg = RESOURCE_CONFIG[kind];
  const pct = Math.min(100, (current / max) * 100);

  return (
    <div
      className={`flex items-center gap-3 bg-realm-900 border ${cfg.accent} px-3 py-2 min-w-[170px]`}
    >
      <div
        className={`w-8 h-8 flex items-center justify-center flex-shrink-0 ${cfg.iconBg} border ${cfg.accent}`}
      >
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
            <span className="text-xs text-sky-400 ml-auto flex-shrink-0">{formatRate(rate)}</span>
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
}
