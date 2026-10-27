import { RESOURCE_KINDS } from '@/features/game-engine/engine';
import { useAtomValue } from 'jotai';
import { Meter } from '@/components/ui/meter';
import { formatRate } from '@/lib/format';
import { productionAtom, resourcesAtom } from '@/store/gameAtoms';
import { resourceEventsAtom } from '@/store/resourceEventsAtom';
import { RESOURCE_NAMES } from '@/features/game/resourceNames';
import { ResourceIcon } from './ResourceIcon';

interface ResourceMetersProps {
  size: 'md' | 'compact';
  className: string;
}

export function ResourceMeters({ size, className }: ResourceMetersProps) {
  const resources = useAtomValue(resourcesAtom);
  const production = useAtomValue(productionAtom);
  const events = useAtomValue(resourceEventsAtom);
  const compact = size === 'compact';

  return (
    <ul className={className}>
      {RESOURCE_KINDS.map((kind) => (
        <li key={kind} className="min-w-0">
          <Meter
            data-testid={compact ? `resource-bar-${kind}-compact` : `resource-bar-${kind}`}
            label={RESOURCE_NAMES[kind]}
            value={Math.floor(resources.current[kind])}
            max={resources.max[kind]}
            size={size}
            icon={<ResourceIcon kind={kind} />}
            highlightKey={events[kind]}
            rate={
              !compact && production[kind] > 0 ? (
                <span data-testid={`resource-bar-${kind}-rate`}>
                  {formatRate(production[kind])}
                </span>
              ) : undefined
            }
          />
        </li>
      ))}
    </ul>
  );
}
