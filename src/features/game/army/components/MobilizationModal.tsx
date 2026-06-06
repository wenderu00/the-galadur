import { useAtomValue } from 'jotai';
import { militaryUnitsAtom } from '@/store/gameAtoms';
import { ALL_UNIT_IDS } from '@/config/units';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { MobilizationUnitRow } from './MobilizationUnitRow';
import type { EnemyDefinition } from '@/features/game-engine/combat-types';
import type { MilitaryUnits, UnitId } from '@/features/game-engine/military-types';

interface MobilizationModalProps {
  enemy: EnemyDefinition;
  mobilization: Partial<MilitaryUnits>;
  onSetMobilization: (unitId: UnitId, count: number) => void;
  onConfirm: () => void;
  onClose: () => void;
}

export function MobilizationModal({
  enemy,
  mobilization,
  onSetMobilization,
  onConfirm,
  onClose,
}: MobilizationModalProps) {
  const units = useAtomValue(militaryUnitsAtom);
  const totalSelected = ALL_UNIT_IDS.reduce((sum, id) => sum + (mobilization[id] ?? 0), 0);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-[calc(100%-1rem)] sm:max-w-sm p-0 gap-0 bg-realm-950 border-realm-700 rounded-none">
        <DialogHeader className="px-4 py-3 border-b border-realm-800">
          <p className="text-sm font-bold text-white">Mobilizar para atacar {enemy.name}</p>
        </DialogHeader>
        <ul className="px-4 py-4 space-y-3">
          {ALL_UNIT_IDS.map((id) => (
            <MobilizationUnitRow
              key={id}
              unitId={id}
              count={mobilization[id] ?? 0}
              available={units[id]}
              onDecrement={() => onSetMobilization(id, Math.max(0, (mobilization[id] ?? 0) - 1))}
              onIncrement={() =>
                onSetMobilization(id, Math.min(units[id], (mobilization[id] ?? 0) + 1))
              }
            />
          ))}
        </ul>
        <DialogFooter className="px-4 py-3 border-t border-realm-800 gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-realm-400 hover:text-white">
            Cancelar
          </button>
          <button
            data-testid="mobilization-confirm"
            disabled={totalSelected === 0}
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium bg-violet-700 hover:bg-violet-600 text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Atacar ({totalSelected})
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
