import { useAtomValue } from 'jotai';
import { resourcesAtom, buildQueueAtom } from '@/store/gameAtoms';
import { BUILDING_DEFINITIONS, getBuildingLevelDef } from '@/config/buildings';
import { canAfford } from '@/features/game-engine/engine';
import { BuildingIcon } from './BuildingIcon';
import { ProgressBar } from './ProgressBar';
import type { BuildingState, ResourceKind } from '@/features/game-engine/types';

interface BuildingCardProps {
  building: BuildingState;
  onOpenModal: () => void;
}

const RESOURCE_LABELS: Record<ResourceKind, string> = {
  wood: 'madeira',
  stone: 'pedra',
  food: 'comida',
  gold: 'ouro',
};

const RESOURCE_ORDER: ResourceKind[] = ['wood', 'stone', 'food', 'gold'];

export function BuildingCard({ building, onOpenModal }: BuildingCardProps) {
  const resources = useAtomValue(resourcesAtom);
  const buildQueue = useAtomValue(buildQueueAtom);

  const def = BUILDING_DEFINITIONS[building.id];
  const isMaxLevel = building.level >= def.maxLevel;
  const isConstructing = buildQueue.length > 0;
  const activeEntry = buildQueue.find((e) => e.buildingId === building.id) ?? null;
  const isThisBuilding = activeEntry !== null;

  const nextLevelDef =
    !isMaxLevel && building.level < 3
      ? getBuildingLevelDef(
          building.id,
          (building.level + 1) as Exclude<typeof building.level, 0>,
        )
      : null;

  const canAffordNext = nextLevelDef
    ? canAfford(resources.current, nextLevelDef.cost)
    : false;

  const upgradeDisabled = isMaxLevel || isConstructing || !canAffordNext;

  const currentLevelDef =
    building.level > 0
      ? getBuildingLevelDef(
          building.id,
          building.level as Exclude<typeof building.level, 0>,
        )
      : null;

  const production = currentLevelDef?.effects.productionPerTick ?? {};
  const hasProduction = RESOURCE_ORDER.some((k) => (production[k] ?? 0) > 0);
  const storageBonus = currentLevelDef?.effects.storageBonus ?? {};
  const hasStorage = RESOURCE_ORDER.some((k) => (storageBonus[k] ?? 0) > 0);

  function upgradeLabel(): string {
    if (isMaxLevel) return 'Nível Máximo';
    if (isThisBuilding) return 'Em construção...';
    if (isConstructing) return 'Fila ocupada';
    if (!canAffordNext) return 'Recursos insuficientes';
    return `Upar para Nível ${building.level + 1}`;
  }

  return (
    <div
      onClick={onOpenModal}
      className="flex flex-col bg-realm-900 border border-realm-800 hover:border-blue-700/60 transition-colors duration-200 cursor-pointer overflow-hidden group"
    >
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 flex items-center justify-center bg-blue-950 border border-blue-800/60 flex-shrink-0 group-hover:border-blue-600/80 transition-colors">
            <span className="text-blue-400">
              <BuildingIcon id={building.id} className="w-6 h-6" />
            </span>
          </div>
          <div>
            <h3 className="font-bold text-white text-sm leading-tight">{def.name}</h3>
            <p className="text-xs text-realm-500 mt-0.5">
              Nível {building.level} / {def.maxLevel}
            </p>
          </div>
        </div>

        <p className="text-xs text-realm-400 leading-relaxed line-clamp-3">{def.description}</p>

        {(hasProduction || hasStorage) && (
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {hasProduction &&
              RESOURCE_ORDER.map((k) => {
                const val = production[k] ?? 0;
                if (val === 0) return null;
                return (
                  <span key={k} className="text-xs text-sky-400">
                    +{val % 1 === 0 ? val : val.toFixed(1)} {RESOURCE_LABELS[k]}/s
                  </span>
                );
              })}
            {hasStorage &&
              RESOURCE_ORDER.map((k) => {
                const val = storageBonus[k] ?? 0;
                if (val === 0) return null;
                return (
                  <span key={k} className="text-xs text-amber-400">
                    +{val} armazenamento
                  </span>
                );
              })}
          </div>
        )}

        {isThisBuilding && activeEntry && (
          <ProgressBar startedAt={activeEntry.startedAt} completesAt={activeEntry.completesAt} />
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onOpenModal();
        }}
        disabled={upgradeDisabled}
        className={`w-full py-2.5 text-sm font-semibold flex items-center justify-center gap-2 border-t transition-colors duration-200
          ${upgradeDisabled
            ? 'text-realm-600 bg-realm-950 border-realm-800 cursor-not-allowed'
            : 'text-white bg-sky-600 border-sky-500 hover:bg-sky-500 cursor-pointer'
          }`}
      >
        {!upgradeDisabled && (
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 15l7-7 7 7" />
          </svg>
        )}
        {upgradeLabel()}
      </button>
    </div>
  );
}
