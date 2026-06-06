import { Button } from '@/components/ui/button';
import { BuildingUpgradePrompt } from './BuildingUpgradePrompt';

interface BuildingUpgradeActionsProps {
  isMaxLevel: boolean;
  isConstructing: boolean;
  upgradeDisabled: boolean;
  targetLevel: number;
  onClose: () => void;
  onUpgrade: () => void;
}

export function BuildingUpgradeActions({
  isMaxLevel,
  isConstructing,
  upgradeDisabled,
  targetLevel,
  onClose,
  onUpgrade,
}: BuildingUpgradeActionsProps) {
  return (
    <div className="flex flex-col-reverse sm:flex-row gap-2 w-full">
      <Button
        variant="outline"
        onClick={onClose}
        className="w-full sm:w-auto min-h-[44px] rounded-none border-realm-700 text-realm-400 hover:text-white hover:bg-realm-800 hover:border-realm-600"
      >
        Fechar
      </Button>
      {!isMaxLevel && (
        <BuildingUpgradePrompt
          upgradeDisabled={upgradeDisabled}
          isConstructing={isConstructing}
          targetLevel={targetLevel}
          onUpgrade={onUpgrade}
        />
      )}
      {isMaxLevel && (
        <span className="w-full sm:w-auto px-5 py-2 text-sm text-realm-500 border border-realm-800 text-center">
          Nível Máximo
        </span>
      )}
    </div>
  );
}
