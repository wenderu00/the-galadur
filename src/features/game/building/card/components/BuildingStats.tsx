import { RESOURCE_KINDS } from '@/features/game-engine/engine';
import type { ResourceKind } from '@/features/game-engine/types';
import { formatNumber, formatRate } from '@/lib/format';
import { RESOURCE_NAMES } from '@/features/game/resourceNames';

interface BuildingStatsProps {
  production: Partial<Record<ResourceKind, number>>;
  storageBonus: Partial<Record<ResourceKind, number>>;
}

export function BuildingStats({ production, storageBonus }: BuildingStatsProps) {
  const producing = RESOURCE_KINDS.filter((kind) => (production[kind] ?? 0) > 0);
  const storing = RESOURCE_KINDS.filter((kind) => (storageBonus[kind] ?? 0) > 0);

  if (producing.length === 0 && storing.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-mono-xs text-ink-soft">
      {producing.map((kind) => (
        <li key={`production-${kind}`}>
          {RESOURCE_NAMES[kind]} {formatRate(production[kind] ?? 0)}
        </li>
      ))}
      {storing.map((kind) => (
        <li key={`storage-${kind}`}>
          +{formatNumber(storageBonus[kind] ?? 0)} de armazenamento de{' '}
          {RESOURCE_NAMES[kind].toLowerCase()}
        </li>
      ))}
    </ul>
  );
}
