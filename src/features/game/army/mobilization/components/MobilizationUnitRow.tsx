import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { UNIT_DEFINITIONS } from '@/config/units';
import type { UnitId } from '@/features/game-engine/military-types';
import { formatNumber } from '@/lib/format';

const UNIT_PLURALS: Record<UnitId, string> = {
  warrior: 'guerreiros',
  archer: 'arqueiros',
  lancer: 'lanceiros',
};

interface MobilizationUnitRowProps {
  unitId: UnitId;
  count: number;
  available: number;
  onChange: (count: number) => void;
}

export function MobilizationUnitRow({
  unitId,
  count,
  available,
  onChange,
}: MobilizationUnitRowProps) {
  const plural = UNIT_PLURALS[unitId];

  return (
    <li>
      <FormField
        label={UNIT_DEFINITIONS[unitId].name}
        description={`${formatNumber(available)} disponíveis`}
      >
        <NumberInput
          data-testid={`mobilization-unit-${unitId}-count`}
          min={0}
          max={available}
          value={count}
          disabled={available === 0}
          onValueChange={(value) => onChange(Math.min(available, Math.max(0, value ?? 0)))}
          decrementLabel={`Diminuir ${plural}`}
          incrementLabel={`Aumentar ${plural}`}
        />
      </FormField>
    </li>
  );
}
