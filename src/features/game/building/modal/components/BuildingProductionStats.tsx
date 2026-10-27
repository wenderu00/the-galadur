import { RESOURCE_KINDS } from '@/features/game-engine/engine';
import type { ResourceKind } from '@/features/game-engine/types';
import { formatRate } from '@/lib/format';
import { RESOURCE_NAMES } from '@/features/game/resourceNames';
import { PanelSection } from '@/features/game/components/PanelSection';

interface BuildingProductionStatsProps {
  production: Partial<Record<ResourceKind, number>>;
}

export function BuildingProductionStats({ production }: BuildingProductionStatsProps) {
  const producing = RESOURCE_KINDS.filter((kind) => (production[kind] ?? 0) > 0);

  return (
    <PanelSection title="Produção atual" headingLevel="h3">
      {producing.length === 0 ? (
        <p className="text-sm text-ink-muted">Este edifício não produz recursos.</p>
      ) : (
        <ul className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-mono-sm">
          {producing.map((kind) => (
            <li key={kind}>
              {RESOURCE_NAMES[kind]} {formatRate(production[kind] ?? 0)}
            </li>
          ))}
        </ul>
      )}
    </PanelSection>
  );
}
