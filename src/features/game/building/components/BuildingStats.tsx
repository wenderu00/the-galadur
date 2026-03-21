import type { ResourceKind } from '@/features/game-engine/types';

const RESOURCE_LABELS: Record<ResourceKind, string> = {
  wood: 'madeira',
  stone: 'pedra',
  food: 'comida',
  gold: 'ouro',
};

const RESOURCE_ORDER: ResourceKind[] = ['wood', 'stone', 'food', 'gold'];

interface BuildingStatsProps {
  production: Partial<Record<ResourceKind, number>>;
  storageBonus: Partial<Record<ResourceKind, number>>;
}

export function BuildingStats({ production, storageBonus }: BuildingStatsProps) {
  const hasProduction = RESOURCE_ORDER.some((k) => (production[k] ?? 0) > 0);
  const hasStorage = RESOURCE_ORDER.some((k) => (storageBonus[k] ?? 0) > 0);

  if (!hasProduction && !hasStorage) return null;

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1">
      {hasProduction &&
        RESOURCE_ORDER.map((k) => {
          const val = production[k] ?? 0;
          if (val === 0) return null;
          return (
            <span key={k} className="text-xs text-sky-400">
              +{val % 1 === 0 ? val : val.toFixed(1)} {RESOURCE_LABELS[k]}/s
            </span>
          );
        })}
      {hasStorage &&
        RESOURCE_ORDER.map((k) => {
          const val = storageBonus[k] ?? 0;
          if (val === 0) return null;
          return (
            <span key={k} className="text-xs text-amber-400">
              +{val} armazenamento
            </span>
          );
        })}
    </div>
  );
}
