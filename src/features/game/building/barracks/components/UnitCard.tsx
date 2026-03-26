import { useTraining } from '@/features/game-engine/hooks/useTraining';
import { UnitIcon } from './UnitIcon';
import type { UnitCardData } from '../hooks/useBarracksPanel';

interface UnitCardProps {
  data: UnitCardData;
  isTraining: boolean;
}

const RESOURCE_LABELS: Record<string, string> = {
  food: 'comida',
  gold: 'ouro',
  wood: 'madeira',
};

export function UnitCard({ data, isTraining }: UnitCardProps) {
  const train = useTraining();
  const { def, count, affordable } = data;
  const disabled = isTraining || !affordable;

  const costEntries = (
    Object.entries(def.baseCost) as [string, number][]
  ).filter(([, v]) => v > 0);

  return (
    <li data-testid={`unit-card-${def.id}`} className="flex items-center gap-3 bg-realm-900 border border-realm-800 p-2">
      <span className="text-blue-400 shrink-0">
        <UnitIcon id={def.id} className="w-10 h-10" />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{def.name}</p>
        <p className="text-xs text-realm-400">
          {costEntries.map(([k, v]) => `${v} ${RESOURCE_LABELS[k] ?? k}`).join(' · ')}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span data-testid={`unit-count-${def.id}`} className="text-xs text-gold-300 font-mono">×{count}</span>
        <button
          data-testid={`unit-train-${def.id}`}
          onClick={() => train(def.id)}
          disabled={disabled}
          className="text-xs px-2 py-1 border border-gold-700 text-gold-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gold-700/20 transition-colors"
        >
          Treinar
        </button>
      </div>
    </li>
  );
}
