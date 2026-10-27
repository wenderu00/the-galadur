import { ALL_UNIT_IDS, UNIT_DEFINITIONS } from '@/config/units';
import type { BattleResult } from '@/features/game-engine/combat-types';
import { PanelSection } from '@/features/game/components/PanelSection';
import { formatNumber } from '@/lib/format';

interface BattleLossesProps {
  result: BattleResult;
}

export function BattleLosses({ result }: BattleLossesProps) {
  const lost = ALL_UNIT_IDS.filter((id) => (result.unitsSent[id] ?? 0) > 0);

  if (lost.length === 0) return null;

  return (
    <PanelSection title="Unidades perdidas" headingLevel="h3">
      <ul className="flex flex-col gap-1 font-mono text-mono-sm text-danger-text">
        {lost.map((id) => (
          <li key={id}>
            {formatNumber(result.unitsSent[id] ?? 0)} {UNIT_DEFINITIONS[id].name}
          </li>
        ))}
      </ul>
    </PanelSection>
  );
}
