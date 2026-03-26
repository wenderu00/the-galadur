import { ProgressBar } from '@/features/game/components/ProgressBar';
import { UNIT_DEFINITIONS } from '@/config/units';
import type { TrainingQueueEntry } from '@/features/game-engine/military-types';

interface TrainingProgressProps {
  entry: TrainingQueueEntry;
}

export function TrainingProgress({ entry }: TrainingProgressProps) {
  const unit = UNIT_DEFINITIONS[entry.unitId];
  const svgSrc = `${import.meta.env.BASE_URL}assets/${entry.unitId}.svg`;

  return (
    <section className="space-y-2 pt-3 border-t border-realm-800">
      <p className="text-xs font-medieval uppercase tracking-widest text-realm-500">
        Treinando
      </p>
      <div className="flex items-center gap-2 mb-1">
        <img src={svgSrc} alt={unit.name} className="w-6 h-6 object-contain opacity-80" />
        <span className="text-sm text-white">{unit.name}</span>
      </div>
      <ProgressBar startedAt={entry.startedAt} completesAt={entry.completesAt} />
    </section>
  );
}
