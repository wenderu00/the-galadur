import type { ResourceKind } from '@/features/game-engine/types';

const RESOURCE_LABELS: Record<ResourceKind, string> = {
  wood: 'Madeira',
  stone: 'Pedra',
  food: 'Comida',
  gold: 'Ouro',
};

const RESOURCE_ORDER: ResourceKind[] = ['wood', 'stone', 'food', 'gold'];

function formatSeconds(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

interface BuildingUpgradeCostsProps {
  costs: Partial<Record<ResourceKind, number>>;
  buildTimeSeconds: number;
  nextProduction: Partial<Record<ResourceKind, number>>;
  currentResources: Record<ResourceKind, number>;
}

export function BuildingUpgradeCosts({
  costs,
  buildTimeSeconds,
  nextProduction,
  currentResources,
}: BuildingUpgradeCostsProps) {
  return (
    <div className="bg-realm-900 border border-realm-800 p-3 space-y-2">
      <p className="text-xs font-medieval uppercase tracking-widest text-realm-500">
        Próximo nível — custo
      </p>
      <div className="flex flex-wrap gap-2">
        {RESOURCE_ORDER.map((kind) => {
          const cost = costs[kind];
          if (!cost || cost === 0) return null;
          const affordable = currentResources[kind] >= cost;
          return (
            <span key={kind} className={`text-sm ${affordable ? 'text-white' : 'text-red-400'}`}>
              {cost} {RESOURCE_LABELS[kind]}
            </span>
          );
        })}
      </div>
      <p className="text-xs text-realm-500">Tempo: {formatSeconds(buildTimeSeconds)}</p>
      {RESOURCE_ORDER.some((k) => (nextProduction[k] ?? 0) > 0) && (
        <div className="flex flex-wrap gap-2 pt-1 border-t border-realm-800">
          <span className="text-xs text-realm-500">Nova produção:</span>
          {RESOURCE_ORDER.map((kind) => {
            const val = nextProduction[kind] ?? 0;
            if (val === 0) return null;
            return (
              <span key={kind} className="text-xs text-sky-400">
                +{val % 1 === 0 ? val : val.toFixed(1)} {RESOURCE_LABELS[kind]}/s
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
