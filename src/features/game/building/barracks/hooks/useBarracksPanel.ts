import { useAtomValue } from 'jotai';
import {
  buildingsAtom,
  resourcesAtom,
  militaryUnitsAtom,
  activeTrainingAtom,
  isTrainingAtom,
} from '@/store/gameAtoms';
import { UNIT_DEFINITIONS } from '@/config/units';
import { getUnlockedUnitIds } from '@/features/game-engine/military-engine';
import { canAfford } from '@/features/game-engine/engine';
import type { UnitDefinition } from '@/config/units';

export interface UnitCardData {
  def: UnitDefinition;
  count: number;
  affordable: boolean;
}

export function useBarracksPanel() {
  const buildings = useAtomValue(buildingsAtom);
  const resources = useAtomValue(resourcesAtom);
  const militaryUnits = useAtomValue(militaryUnitsAtom);
  const activeTraining = useAtomValue(activeTrainingAtom);
  const isTraining = useAtomValue(isTrainingAtom);

  const barracksLevel = buildings['barracks'].level;
  const unlockedIds = getUnlockedUnitIds(barracksLevel);

  const units: UnitCardData[] = unlockedIds.map((id) => ({
    def: UNIT_DEFINITIONS[id],
    count: militaryUnits[id] ?? 0,
    affordable: canAfford(resources.current, UNIT_DEFINITIONS[id].baseCost),
  }));

  return { barracksLevel, units, activeTraining, isTraining };
}
