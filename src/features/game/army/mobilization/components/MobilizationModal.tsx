import { useAtomValue } from 'jotai';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ALL_UNIT_IDS } from '@/config/units';
import type { EnemyDefinition } from '@/features/game-engine/combat-types';
import type { MilitaryUnits, UnitId } from '@/features/game-engine/military-types';
import { formatNumber } from '@/lib/format';
import { militaryUnitsAtom } from '@/store/gameAtoms';
import { MobilizationUnitRow } from './MobilizationUnitRow';

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
      <DialogContent size="sm" closeLabel="Cancelar ataque">
        <DialogHeader>
          <DialogTitle>Atacar {enemy.name}?</DialogTitle>
          <DialogDescription>Escolha quantas tropas mobilizar para a batalha.</DialogDescription>
        </DialogHeader>
        <ul className="flex flex-col gap-4">
          {ALL_UNIT_IDS.map((id) => (
            <MobilizationUnitRow
              key={id}
              unitId={id}
              count={mobilization[id] ?? 0}
              available={units[id]}
              onChange={(count) => onSetMobilization(id, count)}
            />
          ))}
        </ul>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            data-testid="mobilization-confirm"
            disabled={totalSelected === 0}
            onClick={onConfirm}
          >
            Atacar com {formatNumber(totalSelected)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
