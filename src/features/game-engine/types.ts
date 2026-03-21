export type ResourceKind = 'wood' | 'stone' | 'food' | 'gold';

export interface ResourceAmount {
  wood: number;
  stone: number;
  food: number;
  gold: number;
}

export interface ResourceStore {
  current: ResourceAmount;
  max: ResourceAmount;
}

export type BuildingId =
  | 'castle'
  | 'farm'
  | 'sawmill'
  | 'mine'
  | 'market'
  | 'barracks';

export type BuildingLevel = 0 | 1 | 2 | 3;

export interface BuildingState {
  id: BuildingId;
  level: BuildingLevel;
}

export interface BuildQueueEntry {
  buildingId: BuildingId;
  targetLevel: Exclude<BuildingLevel, 0>;
  startedAt: number;
  completesAt: number;
}

export interface GameState {
  resources: ResourceStore;
  buildings: Record<BuildingId, BuildingState>;
  buildQueue: BuildQueueEntry[];
  lastSavedAt: number;
  version: number;
}

export interface BuildingLevelEffects {
  productionPerTick: Partial<ResourceAmount>;
  storageBonus: Partial<ResourceAmount>;
}

export interface BuildingLevelDefinition {
  level: Exclude<BuildingLevel, 0>;
  cost: ResourceAmount;
  buildTimeSeconds: number;
  effects: BuildingLevelEffects;
}

export interface BuildingDefinition {
  id: BuildingId;
  name: string;
  description: string;
  category: 'headquarters' | 'producer' | 'military';
  maxLevel: 3;
  levels: [BuildingLevelDefinition, BuildingLevelDefinition, BuildingLevelDefinition];
}

export type ConstructionResult =
  | { success: true; state: GameState }
  | {
      success: false;
      error: 'queue_full' | 'max_level' | 'cannot_afford' | 'already_max_level';
    };
