import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { BattleResult } from '@/features/game-engine/combat-types';
import { BattleLoot } from './BattleLoot';
import { BattleLosses } from './BattleLosses';

interface BattleResultOverlayProps {
  result: BattleResult;
  onClose: () => void;
}

export function BattleResultOverlay({ result, onClose }: BattleResultOverlayProps) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="sm" data-testid="battle-result" showClose={false}>
        <DialogHeader>
          <DialogTitle
            data-testid="battle-result-outcome"
            className={result.won ? undefined : 'text-danger-text'}
          >
            {result.won ? 'Vitória' : 'Derrota'}
          </DialogTitle>
          <DialogDescription>
            {result.won
              ? 'Suas tropas venceram e voltaram com o saque.'
              : 'Suas tropas foram derrotadas e não voltaram.'}
          </DialogDescription>
        </DialogHeader>
        {result.won ? <BattleLoot result={result} /> : <BattleLosses result={result} />}
        <DialogFooter>
          <Button data-testid="battle-result-dismiss" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
