import { ALL_BUILDING_IDS, getBuildingLevelDef } from '@/config/buildings';
import type { ResourceAmount, BuildingId, BuildingState, BuildingLevel } from './types';
import { zeroAmount, addAmounts } from './math';

export function calculateProduction(
  buildings: Record<BuildingId, BuildingState>,
  castleGoldRate: number = 0
): ResourceAmount {
  return ALL_BUILDING_IDS.reduce<ResourceAmount>((total, id) => {
    const { level } = buildings[id];
    if (level === 0) return total;

    const def = getBuildingLevelDef(id, level as Exclude<BuildingLevel, 0>);
    const prod =
      id === 'castle'
        ? { ...def.effects.productionPerTick, gold: castleGoldRate }
        : def.effects.productionPerTick;
    return addAmounts(total, prod);
  }, zeroAmount());
}

export function calculateConstructionTimeMultiplier(
  buildings: Record<BuildingId, BuildingState>
): number {
  const totalBonus = ALL_BUILDING_IDS.reduce<number>((bonus, id) => {
    const { level } = buildings[id];
    if (level === 0) return bonus;
    const def = getBuildingLevelDef(id, level as Exclude<BuildingLevel, 0>);
    return bonus + (def.effects.constructionSpeedBonus ?? 0);
  }, 0);
  return Math.max(0.1, 1 - totalBonus);
}

export function calculateStorageCaps(buildings: Record<BuildingId, BuildingState>): ResourceAmount {
  return ALL_BUILDING_IDS.reduce<ResourceAmount>((total, id) => {
    const { level } = buildings[id];
    if (level === 0) return total;

    const def = getBuildingLevelDef(id, level as Exclude<BuildingLevel, 0>);
    return addAmounts(total, def.effects.storageBonus);
  }, zeroAmount());
}
