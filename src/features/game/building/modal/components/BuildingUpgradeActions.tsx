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
    <div className="flex w-full flex-col gap-3">
      {isConstructing && !isMaxLevel && (
        <p className="text-sm text-ink-soft">
          A fila de construção está ocupada. Aguarde a obra atual terminar.
        </p>
      )}
      {isMaxLevel && <p className="text-sm text-ink-soft">Este edifício está no nível máximo.</p>}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>
        {!isMaxLevel && (
          <BuildingUpgradePrompt
            upgradeDisabled={upgradeDisabled}
            targetLevel={targetLevel}
            onUpgrade={onUpgrade}
          />
        )}
      </div>
    </div>
  );
}
