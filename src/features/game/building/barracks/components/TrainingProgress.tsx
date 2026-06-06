import { ProgressBar } from '@/features/game/components/ProgressBar';
import { UNIT_DEFINITIONS } from '@/config/units';
import type { TrainingQueueEntry } from '@/features/game-engine/military-types';
import { UnitIcon } from './UnitIcon';

interface TrainingProgressProps {
  entry: TrainingQueueEntry;
}

export function TrainingProgress({ entry }: TrainingProgressProps) {
  const unit = UNIT_DEFINITIONS[entry.unitId];

  return (
    <section className="space-y-2 pt-3 border-t border-realm-800">
      <p className="text-xs font-medieval uppercase tracking-widest text-realm-500">Treinando</p>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-violet-400 shrink-0" aria-hidden="true">
          <UnitIcon id={entry.unitId} className="w-6 h-6 opacity-80" />
        </span>
        <span className="text-sm text-white">{unit.name}</span>
      </div>
      <ProgressBar startedAt={entry.startedAt} completesAt={entry.completesAt} />
    </section>
  );
}
