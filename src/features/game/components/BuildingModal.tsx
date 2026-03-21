import { useAtomValue } from 'jotai';
import { resourcesAtom, buildingsAtom, buildQueueAtom } from '@/store/gameAtoms';
import { useUpgrade } from '@/features/game-engine/hooks/useUpgrade';
import { BUILDING_DEFINITIONS, getBuildingLevelDef } from '@/config/buildings';
import { canAfford } from '@/features/game-engine/engine';
import { BuildingIcon } from './BuildingIcon';
import type { BuildingId, ResourceKind } from '@/features/game-engine/types';

interface BuildingModalProps {
  buildingId: BuildingId;
  onClose: () => void;
}

const RESOURCE_LABELS: Record<ResourceKind, string> = {
  wood: 'Madeira',
  stone: 'Pedra',
  food: 'Comida',
  gold: 'Ouro',
};

const RESOURCE_ORDER: ResourceKind[] = ['wood', 'stone', 'food', 'gold'];

function formatSeconds(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

export function BuildingModal({ buildingId, onClose }: BuildingModalProps) {
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

  const canAffordNext = nextLevelDef
    ? canAfford(resources.current, nextLevelDef.cost)
    : false;

  const upgradeDisabled = isMaxLevel || isConstructing || !canAffordNext;

  const handleUpgrade = () => {
    if (upgradeDisabled) return;
    upgrade(buildingId);
    onClose();
  };

  const currentProduction = currentLevelDef?.effects.productionPerTick ?? {};
  const nextProduction = nextLevelDef?.effects.productionPerTick ?? {};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-realm-950 border border-realm-700 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-realm-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-950 border border-blue-800">
              <span className="text-blue-400">
                <BuildingIcon id={buildingId} className="w-6 h-6" />
              </span>
            </div>
            <div>
              <h2 className="font-bold text-white">{def.name}</h2>
              <p className="text-xs text-realm-500">
                {isMaxLevel ? 'Nível Máximo' : `Nível ${building.level} / ${def.maxLevel}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-realm-600 hover:text-realm-300 transition-colors text-lg leading-none w-7 h-7 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <p className="text-sm text-realm-400 leading-relaxed">{def.description}</p>

          {currentLevelDef && (
            <div className="bg-realm-900 border border-realm-800 p-3">
              <p className="text-[10px] font-medieval uppercase tracking-widest text-realm-500 mb-2">
                Produção atual
              </p>
              <div className="flex flex-wrap gap-2">
                {RESOURCE_ORDER.map((kind) => {
                  const val = currentProduction[kind] ?? 0;
                  if (val === 0) return null;
                  return (
                    <span key={kind} className="text-sm text-sky-400">
                      +{val % 1 === 0 ? val : val.toFixed(1)} {RESOURCE_LABELS[kind]}/s
                    </span>
                  );
                })}
                {Object.values(currentProduction).every((v) => !v || v === 0) && (
                  <span className="text-sm text-realm-600">—</span>
                )}
              </div>
            </div>
          )}

          {nextLevelDef && (
            <div className="bg-realm-900 border border-realm-800 p-3 space-y-2">
              <p className="text-[10px] font-medieval uppercase tracking-widest text-realm-500">
                Próximo nível — custo
              </p>
              <div className="flex flex-wrap gap-2">
                {RESOURCE_ORDER.map((kind) => {
                  const cost = nextLevelDef.cost[kind];
                  if (cost === 0) return null;
                  const affordable = resources.current[kind] >= cost;
                  return (
                    <span
                      key={kind}
                      className={`text-sm ${affordable ? 'text-white' : 'text-red-400'}`}
                    >
                      {cost} {RESOURCE_LABELS[kind]}
                    </span>
                  );
                })}
              </div>
              <p className="text-xs text-realm-500">
                Tempo: {formatSeconds(nextLevelDef.buildTimeSeconds)}
              </p>
              {Object.values(nextProduction).some((v) => v && v > 0) && (
                <div className="flex flex-wrap gap-2 pt-1 border-t border-realm-800">
                  <span className="text-[11px] text-realm-500">Nova produção:</span>
                  {RESOURCE_ORDER.map((kind) => {
                    const val = nextProduction[kind] ?? 0;
                    if (val === 0) return null;
                    return (
                      <span key={kind} className="text-[11px] text-sky-400">
                        +{val % 1 === 0 ? val : val.toFixed(1)} {RESOURCE_LABELS[kind]}/s
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-realm-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-realm-500 hover:text-white border border-realm-700 hover:border-realm-600 transition-colors"
          >
            Fechar
          </button>
          {!isMaxLevel && (
            <button
              onClick={handleUpgrade}
              disabled={upgradeDisabled}
              className={`px-5 py-2 text-sm font-semibold flex items-center gap-2 transition-colors
                ${upgradeDisabled
                  ? 'text-realm-600 bg-realm-900 border border-realm-800 cursor-not-allowed'
                  : 'text-white bg-sky-600 border border-sky-500 hover:bg-sky-500 cursor-pointer'
                }`}
            >
              {!upgradeDisabled && (
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 15l7-7 7 7" />
                </svg>
              )}
              {isConstructing ? 'Em Construção...' : `Upar para Nível ${building.level + 1}`}
            </button>
          )}
          {isMaxLevel && (
            <span className="px-5 py-2 text-sm text-realm-500 border border-realm-800">
              Nível Máximo
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
