import { useAtomValue } from 'jotai';
import { resourcesAtom, buildingsAtom, buildQueueAtom } from '@/store/gameAtoms';
import { useUpgrade } from '@/features/game-engine/hooks/useUpgrade';
import { BUILDING_DEFINITIONS, getBuildingLevelDef } from '@/config/buildings';
import { canAfford } from '@/features/game-engine/engine';
import type { BuildingId } from '@/features/game-engine/types';

export function useBuildingModal(buildingId: BuildingId, onClose: () => void) {
  const buildings = useAtomValue(buildingsAtom);
  const resources = useAtomValue(resourcesAtom);
  const buildQueue = useAtomValue(buildQueueAtom);
  const upgrade = useUpgrade();

  const building = buildings[buildingId];
  const def = BUILDING_DEFINITIONS[buildingId];
  const isMaxLevel = building.level >= def.maxLevel;
  const isConstructing = buildQueue.length > 0;

  const currentLevelDef =
    building.level > 0
      ? getBuildingLevelDef(buildingId, building.level as Exclude<typeof building.level, 0>)
      : null;

  const nextLevelDef = !isMaxLevel
    ? getBuildingLevelDef(buildingId, (building.level + 1) as Exclude<typeof building.level, 0>)
    : null;

  const upgradeDisabled =
    isMaxLevel || isConstructing || !canAfford(resources.current, nextLevelDef?.cost ?? {});

  const handleUpgrade = () => {
    if (upgradeDisabled) return;
    upgrade(buildingId);
    onClose();
  };

  return {
    building,
    def,
    isMaxLevel,
    isConstructing,
    currentLevelDef,
    nextLevelDef,
    upgradeDisabled,
    resources,
    handleUpgrade,
  };
}
