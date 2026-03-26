import type { ResourceKind } from '@/features/game-engine/types';

const RESOURCE_LABELS: Record<ResourceKind, string> = {
  wood: 'Madeira',
  stone: 'Pedra',
  food: 'Comida',
  gold: 'Ouro',
};

const RESOURCE_ORDER: ResourceKind[] = ['wood', 'stone', 'food', 'gold'];

interface BuildingProductionStatsProps {
  production: Partial<Record<ResourceKind, number>>;
}

export function BuildingProductionStats({ production }: BuildingProductionStatsProps) {
  return (
    <div className="bg-realm-900 border border-realm-800 p-3">
      <p className="text-xs font-medieval uppercase tracking-widest text-realm-500 mb-2">
        Produção atual
      </p>
      <div className="flex flex-wrap gap-2">
        {RESOURCE_ORDER.map((kind) => {
          const val = production[kind] ?? 0;
          if (val === 0) return null;
          return (
            <span key={kind} className="text-sm text-sky-400">
              +{val % 1 === 0 ? val : val.toFixed(1)} {RESOURCE_LABELS[kind]}/s
            </span>
          );
        })}
        {RESOURCE_ORDER.every((k) => !production[k]) && (
          <span className="text-sm text-realm-600">—</span>
        )}
      </div>
    </div>
  );
}
