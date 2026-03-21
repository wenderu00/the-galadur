import type { BuildingId, BuildingLevel, BuildingLevelDefinition } from '@/features/game-engine/types';
import type { BuildingDefinition } from '@/features/game-engine/types';
import { castle } from './castle';
import { farm } from './farm';
import { sawmill } from './sawmill';
import { mine } from './mine';
import { market } from './market';
import { barracks } from './barracks';
import { prefeitura } from './prefeitura';

export const BUILDING_DEFINITIONS: Record<BuildingId, BuildingDefinition> = {
  castle,
  farm,
  sawmill,
  mine,
  market,
  barracks,
  prefeitura,
};

export const ALL_BUILDING_IDS: BuildingId[] = Object.keys(
  BUILDING_DEFINITIONS,
) as BuildingId[];

export function getBuildingLevelDef(
  id: BuildingId,
  level: Exclude<BuildingLevel, 0>,
): BuildingLevelDefinition {
  return BUILDING_DEFINITIONS[id].levels[level - 1];
}
