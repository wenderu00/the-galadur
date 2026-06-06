import type { UnitId } from '@/features/game-engine/military-types';
import { UNIT_DEFINITIONS } from '@/config/units';

interface MobilizationUnitRowProps {
  unitId: UnitId;
  count: number;
  available: number;
  onDecrement: () => void;
  onIncrement: () => void;
}

export function MobilizationUnitRow({
  unitId,
  count,
  available,
  onDecrement,
  onIncrement,
}: MobilizationUnitRowProps) {
  return (
    <li className="flex items-center justify-between">
      <span className="text-sm text-realm-300">
        {UNIT_DEFINITIONS[unitId].name}{' '}
        <span className="text-realm-500">({available} disponíveis)</span>
      </span>
      <div className="flex items-center gap-2">
        <button
          data-testid={`mobilization-unit-${unitId}-decrement`}
          onClick={onDecrement}
          className="w-7 h-7 bg-realm-800 text-white hover:bg-realm-700 disabled:opacity-40"
          disabled={count === 0}
        >
          −
        </button>
        <span
          data-testid={`mobilization-unit-${unitId}-count`}
          className="w-6 text-center text-sm text-white"
        >
          {count}
        </span>
        <button
          data-testid={`mobilization-unit-${unitId}-increment`}
          onClick={onIncrement}
          className="w-7 h-7 bg-realm-800 text-white hover:bg-realm-700 disabled:opacity-40"
          disabled={count >= available}
        >
          +
        </button>
      </div>
    </li>
  );
}
