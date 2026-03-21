import { useAtomValue } from 'jotai';
import { resourcesAtom, buildQueueAtom } from '@/store/gameAtoms';
import { BUILDING_DEFINITIONS, getBuildingLevelDef } from '@/config/buildings';
import { canAfford } from '@/features/game-engine/engine';
import type { BuildingState } from '@/features/game-engine/types';

export function useBuildingCard(building: BuildingState) {
  const resources = useAtomValue(resourcesAtom);
  const buildQueue = useAtomValue(buildQueueAtom);

  const def = BUILDING_DEFINITIONS[building.id];
  const isMaxLevel = building.level >= def.maxLevel;
  const isConstructing = buildQueue.length > 0;
  const activeEntry = buildQueue.find((e) => e.buildingId === building.id) ?? null;

  const nextLevelDef =
    !isMaxLevel && building.level < 3
      ? getBuildingLevelDef(
          building.id,
          (building.level + 1) as Exclude<typeof building.level, 0>,
        )
      : null;

  const canAffordNext = nextLevelDef ? canAfford(resources.current, nextLevelDef.cost) : false;
  const upgradeDisabled = isMaxLevel || isConstructing || !canAffordNext;

  const currentLevelDef =
    building.level > 0
      ? getBuildingLevelDef(
          building.id,
          building.level as Exclude<typeof building.level, 0>,
        )
      : null;

  function upgradeLabel(): string {
    if (isMaxLevel) return 'Nível Máximo';
    if (activeEntry !== null) return 'Em construção...';
    if (isConstructing) return 'Fila ocupada';
    if (!canAffordNext) return 'Recursos insuficientes';
    return `Upar para Nível ${building.level + 1}`;
  }

  return { def, isMaxLevel, activeEntry, upgradeDisabled, currentLevelDef, upgradeLabel };
}
