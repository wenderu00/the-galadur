import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/dialog';
import type { BuildingId } from '@/features/game-engine/types';
import type { ReactNode } from 'react';
import { useBuildingModal } from '../hooks/useBuildingModal';
import { BuildingIdentity } from './BuildingIdentity';
import { BuildingProductionStats } from './BuildingProductionStats';
import { BuildingUpgradeActions } from './BuildingUpgradeActions';
import { BuildingUpgradeCosts } from './BuildingUpgradeCosts';

interface BuildingModalProps {
  buildingId: BuildingId;
  extra: ReactNode;
  onClose: () => void;
}

export function BuildingModal({ buildingId, extra, onClose }: BuildingModalProps) {
  const modal = useBuildingModal(buildingId, onClose);
  const { building, def, nextLevelDef, currentLevelDef } = modal;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent showClose={false}>
        <DialogHeader>
          <BuildingIdentity
            buildingId={buildingId}
            name={def.name}
            level={building.level}
            maxLevel={def.maxLevel}
          />
          <DialogDescription>{def.description}</DialogDescription>
        </DialogHeader>
        {currentLevelDef && (
          <BuildingProductionStats production={currentLevelDef.effects.productionPerTick ?? {}} />
        )}
        {nextLevelDef && (
          <BuildingUpgradeCosts
            costs={nextLevelDef.cost}
            buildTimeSeconds={nextLevelDef.buildTimeSeconds}
            nextProduction={nextLevelDef.effects.productionPerTick ?? {}}
            currentResources={modal.resources.current}
          />
        )}
        {extra}
        <DialogFooter>
          <BuildingUpgradeActions
            isMaxLevel={modal.isMaxLevel}
            isConstructing={modal.isConstructing}
            upgradeDisabled={modal.upgradeDisabled}
            targetLevel={building.level + 1}
            onClose={onClose}
            onUpgrade={modal.handleUpgrade}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
