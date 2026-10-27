import { UNIT_DEFINITIONS } from '@/config/units';
import type { TrainingQueueEntry } from '@/features/game-engine/military-types';
import { PanelSection } from '@/features/game/components/PanelSection';
import { TimedProgress } from '@/features/game/components/TimedProgress';

interface TrainingProgressProps {
  entry: TrainingQueueEntry;
}

export function TrainingProgress({ entry }: TrainingProgressProps) {
  return (
    <PanelSection title="Treinando" headingLevel="h3">
      <TimedProgress
        label={UNIT_DEFINITIONS[entry.unitId].name}
        startedAt={entry.startedAt}
        completesAt={entry.completesAt}
      />
    </PanelSection>
  );
}
