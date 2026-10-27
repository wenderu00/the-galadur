import { useAtomValue } from 'jotai';
import { Hammer } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { BUILDING_DEFINITIONS } from '@/config/buildings';
import { buildQueueAtom } from '@/store/gameAtoms';
import { PanelSection } from '../../components/PanelSection';
import { TimedProgress } from '../../components/TimedProgress';

export function ConstructionQueue() {
  const buildQueue = useAtomValue(buildQueueAtom);

  return (
    <PanelSection title="Fila de construção">
      {buildQueue.length === 0 ? (
        <EmptyState
          headingLevel="h3"
          icon={<Hammer aria-hidden="true" />}
          title="Nenhuma construção em andamento"
          description="Abra um edifício na cidade para evoluir o próximo nível."
          className="py-6"
        />
      ) : (
        <ul className="flex flex-col gap-4">
          {buildQueue.map((entry) => (
            <li key={`${entry.buildingId}-${entry.targetLevel}`}>
              <TimedProgress
                label={`${BUILDING_DEFINITIONS[entry.buildingId].name}, nível ${entry.targetLevel}`}
                startedAt={entry.startedAt}
                completesAt={entry.completesAt}
              />
            </li>
          ))}
        </ul>
      )}
    </PanelSection>
  );
}
