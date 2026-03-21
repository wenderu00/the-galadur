import { BuildingIcon } from '@/features/game/components/BuildingIcon';
import { DialogClose, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { BuildingId } from '@/features/game-engine/types';

interface BuildingIdentityProps {
  buildingId: BuildingId;
  name: string;
  level: number;
  maxLevel: number;
  isMaxLevel: boolean;
}

export function BuildingIdentity({
  buildingId,
  name,
  level,
  maxLevel,
  isMaxLevel,
}: BuildingIdentityProps) {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center bg-blue-950 border border-blue-800">
          <span className="text-blue-400">
            <BuildingIcon id={buildingId} className="w-6 h-6" />
          </span>
        </div>
        <div>
          <DialogTitle className="font-bold text-white text-base leading-none">{name}</DialogTitle>
          <p className="text-xs text-realm-500 mt-0.5">
            {isMaxLevel ? 'Nível Máximo' : `Nível ${level} / ${maxLevel}`}
          </p>
        </div>
      </div>
      <DialogClose
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-realm-600 hover:text-realm-300 rounded-none"
          />
        }
      >
        ✕
      </DialogClose>
    </div>
  );
}
