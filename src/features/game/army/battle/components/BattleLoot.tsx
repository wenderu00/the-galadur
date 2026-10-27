import { RESOURCE_KINDS } from '@/features/game-engine/engine';
import type { BattleResult } from '@/features/game-engine/combat-types';
import { PanelSection } from '@/features/game/components/PanelSection';
import { formatResourceGain } from '@/features/game/resourceNames';

interface BattleLootProps {
  result: BattleResult;
}

export function BattleLoot({ result }: BattleLootProps) {
  const looted = RESOURCE_KINDS.filter((kind) => (result.lootGained[kind] ?? 0) > 0);

  if (looted.length === 0) return null;

  return (
    <PanelSection title="Saque obtido" headingLevel="h3">
      <ul className="flex flex-col gap-1 font-mono text-mono-sm">
        {looted.map((kind) => (
          <li key={kind}>{formatResourceGain(kind, result.lootGained[kind] ?? 0)}</li>
        ))}
      </ul>
    </PanelSection>
  );
}
