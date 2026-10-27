import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconTile } from '@/components/ui/icon-tile';
import { useTraining } from '@/features/game-engine/hooks/useTraining';
import type { ResourceKind } from '@/features/game-engine/types';
import { formatResourceAmount } from '@/features/game/resourceNames';
import { UnitIcon } from '@/features/game/components/UnitIcon';
import { formatDuration, formatNumber } from '@/lib/format';
import type { UnitCardData } from '../hooks/useBarracksPanel';

interface UnitCardProps {
  data: UnitCardData;
  isTraining: boolean;
}

export function UnitCard({ data, isTraining }: UnitCardProps) {
  const train = useTraining();
  const { def, count, affordable, trainingSeconds } = data;
  const costs = (Object.entries(def.baseCost) as [ResourceKind, number][]).filter(
    ([, amount]) => amount > 0
  );

  return (
    <li
      data-testid={`unit-card-${def.id}`}
      className="flex items-center gap-3 rounded-control border border-line p-3"
    >
      <IconTile>
        <UnitIcon id={def.id} />
      </IconTile>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="font-semibold">{def.name}</p>
        <p className="text-sm text-ink-soft">
          Custo: {costs.map(([kind, amount]) => formatResourceAmount(kind, amount)).join(', ')}
        </p>
        <p className="font-mono text-mono-xs text-ink-muted">
          Treino:{' '}
          <span data-testid={`unit-training-time-${def.id}`}>
            {formatDuration(trainingSeconds)}
          </span>
        </p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <Badge data-testid={`unit-count-${def.id}`}>×{formatNumber(count)}</Badge>
        <Button
          size="sm"
          data-testid={`unit-train-${def.id}`}
          disabled={isTraining || !affordable}
          onClick={() => train(def.id)}
        >
          Treinar
        </Button>
      </div>
    </li>
  );
}
