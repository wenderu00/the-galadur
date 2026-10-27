import { RESOURCE_KINDS } from '@/features/game-engine/engine';
import type { ResourceKind } from '@/features/game-engine/types';
import { formatDuration, formatRate } from '@/lib/format';
import { RESOURCE_NAMES, formatResourceAmount } from '@/features/game/resourceNames';
import { PanelSection } from '@/features/game/components/PanelSection';
import { cn } from '@/lib/utils';

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
  const costKinds = RESOURCE_KINDS.filter((kind) => (costs[kind] ?? 0) > 0);
  const producing = RESOURCE_KINDS.filter((kind) => (nextProduction[kind] ?? 0) > 0);

  return (
    <PanelSection title="Custo do próximo nível" headingLevel="h3">
      <ul className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-mono-sm">
        {costKinds.map((kind) => {
          const cost = costs[kind] ?? 0;
          const affordable = currentResources[kind] >= cost;
          return (
            <li key={kind} className={cn(!affordable && 'text-danger-text')}>
              {formatResourceAmount(kind, cost)}
              {!affordable && <span className="sr-only"> (insuficiente)</span>}
            </li>
          );
        })}
      </ul>
      <p className="text-sm text-ink-soft">
        Tempo de construção: {formatDuration(buildTimeSeconds)}
      </p>
      {producing.length > 0 && (
        <p className="text-sm text-ink-soft">
          Nova produção:{' '}
          {producing
            .map((kind) => `${RESOURCE_NAMES[kind]} ${formatRate(nextProduction[kind] ?? 0)}`)
            .join(', ')}
        </p>
      )}
    </PanelSection>
  );
}
