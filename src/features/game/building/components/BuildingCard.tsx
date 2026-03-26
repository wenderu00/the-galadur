import { motion } from 'framer-motion';
import { BuildingIcon } from '@/features/game/components/BuildingIcon';
import { ProgressBar } from '@/features/game/components/ProgressBar';
import { BuildingStats } from './BuildingStats';
import { BuildingUpgradeButton } from './BuildingUpgradeButton';
import { useBuildingCard } from '../hooks/useBuildingCard';
import { cardHover } from '@/lib/animations';
import type { BuildingState } from '@/features/game-engine/types';

interface BuildingCardProps {
  building: BuildingState;
  onOpenModal: () => void;
}

export function BuildingCard({ building, onOpenModal }: BuildingCardProps) {
  const { def, activeEntry, upgradeDisabled, currentLevelDef, upgradeLabel } =
    useBuildingCard(building);

  return (
    <motion.article
      data-testid={`building-card-${building.id}`}
      onClick={onOpenModal}
      className="h-full flex flex-row items-start sm:flex-col bg-realm-900 border border-realm-800 cursor-pointer overflow-hidden group"
      whileHover={cardHover.whileHover}
      transition={cardHover.transition}
    >
      <div className="flex-shrink-0 p-3 sm:p-0 sm:pt-4 sm:pl-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-blue-950 border border-blue-800/60 group-hover:border-blue-600/80 transition-colors">
          <span className="text-blue-400">
            <BuildingIcon id={building.id} className="w-5 h-5 sm:w-6 sm:h-6" />
          </span>
        </div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col sm:w-full">
        <div className="flex-1 px-3 py-3 sm:px-4 sm:pb-4 sm:pt-4 flex flex-col gap-1.5 sm:gap-3">
          <div className="flex flex-col gap-0.5">
            <h3 className="font-bold text-white text-sm leading-tight">{def.name}</h3>
            <p data-testid={`building-card-${building.id}-level`} className="text-xs text-realm-500">
              Nível {building.level} / {def.maxLevel}
            </p>
          </div>
          <p className="hidden sm:block text-xs text-realm-400 leading-relaxed line-clamp-3">
            {def.description}
          </p>
          <BuildingStats
            production={currentLevelDef?.effects.productionPerTick ?? {}}
            storageBonus={currentLevelDef?.effects.storageBonus ?? {}}
          />
          {activeEntry && (
            <ProgressBar startedAt={activeEntry.startedAt} completesAt={activeEntry.completesAt} />
          )}
        </div>
        <div className="hidden sm:block">
          <BuildingUpgradeButton
            label={upgradeLabel()}
            disabled={upgradeDisabled}
            onClick={onOpenModal}
          />
        </div>
      </div>

      <div className="sm:hidden flex-shrink-0 flex items-center self-center pr-3 text-realm-600 group-hover:text-realm-400 transition-colors">
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </motion.article>
  );
}
