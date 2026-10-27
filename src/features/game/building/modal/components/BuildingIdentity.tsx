import { DialogTitle } from '@/components/ui/dialog';
import { IconTile } from '@/components/ui/icon-tile';
import type { BuildingId } from '@/features/game-engine/types';
import { BuildingIcon } from '@/features/game/components/BuildingIcon';

interface BuildingIdentityProps {
  buildingId: BuildingId;
  name: string;
  level: number;
  maxLevel: number;
}

export function BuildingIdentity({ buildingId, name, level, maxLevel }: BuildingIdentityProps) {
  const isMaxLevel = level >= maxLevel;

  return (
    <div className="flex items-center gap-4">
      <IconTile size="lg">
        <BuildingIcon id={buildingId} />
      </IconTile>
      <div className="flex flex-col gap-1">
        <DialogTitle>{name}</DialogTitle>
        <p data-testid="building-modal-level" className="font-mono text-mono-xs text-ink-muted">
          {isMaxLevel ? `Nível ${level}, o máximo` : `Nível ${level} de ${maxLevel}`}
        </p>
      </div>
    </div>
  );
}
