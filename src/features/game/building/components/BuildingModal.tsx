import { BuildingIdentity } from './BuildingIdentity';
import { BuildingProductionStats } from './BuildingProductionStats';
import { BuildingUpgradeCosts } from './BuildingUpgradeCosts';
import { BuildingUpgradeActions } from './BuildingUpgradeActions';
import { useBuildingModal } from '../hooks/useBuildingModal';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/dialog';
import type { BuildingId } from '@/features/game-engine/types';

interface BuildingModalProps {
  buildingId: BuildingId;
  onClose: () => void;
}

export function BuildingModal({ buildingId, onClose }: BuildingModalProps) {
  const {
    building,
    def,
    isMaxLevel,
    isConstructing,
    currentLevelDef,
    nextLevelDef,
    upgradeDisabled,
    resources,
    handleUpgrade,
  } = useBuildingModal(buildingId, onClose);

  return (
    <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent
        showCloseButton={false}
        className="max-w-md p-0 gap-0 bg-realm-950 border-realm-700 rounded-none ring-0"
      >
        <DialogHeader className="px-5 py-4 border-b border-realm-800">
          <BuildingIdentity
            buildingId={buildingId}
            name={def.name}
            level={building.level}
            maxLevel={def.maxLevel}
            isMaxLevel={isMaxLevel}
          />
        </DialogHeader>

        <div className="px-5 py-4 space-y-4">
          <p className="text-sm text-realm-400 leading-relaxed">{def.description}</p>
          {currentLevelDef && (
            <BuildingProductionStats production={currentLevelDef.effects.productionPerTick ?? {}} />
          )}
          {nextLevelDef && (
            <BuildingUpgradeCosts
              costs={nextLevelDef.cost}
              buildTimeSeconds={nextLevelDef.buildTimeSeconds}
              nextProduction={nextLevelDef.effects.productionPerTick ?? {}}
              currentResources={resources.current}
            />
          )}
        </div>

        <DialogFooter className="mx-0 mb-0 rounded-none border-t border-realm-800 bg-transparent px-5 py-4">
          <BuildingUpgradeActions
            isMaxLevel={isMaxLevel}
            isConstructing={isConstructing}
            upgradeDisabled={upgradeDisabled}
            targetLevel={building.level + 1}
            onClose={onClose}
            onUpgrade={handleUpgrade}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
