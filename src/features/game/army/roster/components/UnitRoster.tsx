import { useAtomValue } from 'jotai';
import { IconTile } from '@/components/ui/icon-tile';
import { UNIT_DEFINITIONS, ALL_UNIT_IDS } from '@/config/units';
import { UnitIcon } from '@/features/game/components/UnitIcon';
import { PanelSection } from '@/features/game/components/PanelSection';
import { formatNumber } from '@/lib/format';
import { militaryUnitsAtom } from '@/store/gameAtoms';

export function UnitRoster() {
  const units = useAtomValue(militaryUnitsAtom);

  return (
    <PanelSection title="Suas tropas">
      <ul className="flex flex-wrap gap-4">
        {ALL_UNIT_IDS.map((id) => (
          <li key={id} className="flex items-center gap-3 rounded-card border border-line p-4">
            <IconTile>
              <UnitIcon id={id} />
            </IconTile>
            <p className="flex flex-col">
              <span className="text-sm text-ink-soft">{UNIT_DEFINITIONS[id].name}</span>
              <span
                data-testid={`army-unit-${id}-count`}
                className="font-display text-xl font-bold"
              >
                {formatNumber(units[id])}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </PanelSection>
  );
}
