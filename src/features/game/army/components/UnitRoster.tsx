import { useAtomValue } from 'jotai';
import { militaryUnitsAtom } from '@/store/gameAtoms';
import { UNIT_DEFINITIONS, ALL_UNIT_IDS } from '@/config/units';

export function UnitRoster() {
  const units = useAtomValue(militaryUnitsAtom);

  return (
    <section className="mb-6">
      <h2 className="text-sm font-medieval font-bold text-realm-300 uppercase tracking-widest mb-3">
        Suas Tropas
      </h2>
      <ul className="flex gap-4 flex-wrap">
        {ALL_UNIT_IDS.map((id) => (
          <li
            key={id}
            className="flex flex-col items-center gap-1 bg-realm-900 border border-realm-800 px-4 py-3"
          >
            <span className="text-xs text-realm-400">{UNIT_DEFINITIONS[id].name}</span>
            <span data-testid={`army-unit-${id}-count`} className="text-xl font-bold text-white">
              {units[id]}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
