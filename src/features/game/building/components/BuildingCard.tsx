import { BuildingIcon } from '@/features/game/components/BuildingIcon';
import { ProgressBar } from '@/features/game/components/ProgressBar';
import { BuildingStats } from './BuildingStats';
import { BuildingUpgradeButton } from './BuildingUpgradeButton';
import { useBuildingCard } from '../hooks/useBuildingCard';
import type { BuildingState } from '@/features/game-engine/types';

interface BuildingCardProps {
  building: BuildingState;
  onOpenModal: () => void;
}

export function BuildingCard({ building, onOpenModal }: BuildingCardProps) {
  const { def, activeEntry, upgradeDisabled, currentLevelDef, upgradeLabel } =
    useBuildingCard(building);

  return (
    <article
      onClick={onOpenModal}
      className="flex flex-col bg-realm-900 border border-realm-800 hover:border-blue-700/60 transition-colors duration-200 cursor-pointer overflow-hidden group"
    >
      <div className="p-4 flex-1 flex flex-col gap-3">
        <header className="flex items-start gap-3">
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
        </header>

        <p className="text-xs text-realm-400 leading-relaxed line-clamp-3">{def.description}</p>

        <BuildingStats
          production={currentLevelDef?.effects.productionPerTick ?? {}}
          storageBonus={currentLevelDef?.effects.storageBonus ?? {}}
        />

        {activeEntry && (
          <ProgressBar startedAt={activeEntry.startedAt} completesAt={activeEntry.completesAt} />
        )}
      </div>

      <BuildingUpgradeButton
        label={upgradeLabel()}
        disabled={upgradeDisabled}
        onClick={onOpenModal}
      />
    </article>
  );
}
