import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { UNIT_DEFINITIONS, ALL_UNIT_IDS } from '@/config/units';
import { RESOURCE_KINDS } from '@/features/game-engine/engine';
import type { BattleResult } from '@/features/game-engine/combat-types';

interface BattleResultOverlayProps {
  result: BattleResult;
  onClose: () => void;
}

export function BattleResultOverlay({ result, onClose }: BattleResultOverlayProps) {
  const lootEntries = RESOURCE_KINDS.filter((k) => (result.lootGained[k] ?? 0) > 0);
  const lostEntries = ALL_UNIT_IDS.filter((id) => (result.unitsSent[id] ?? 0) > 0 && !result.won);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        data-testid="battle-result"
        className="w-full max-w-[calc(100%-1rem)] sm:max-w-sm p-0 gap-0 bg-realm-950 border-realm-700 rounded-none"
      >
        <DialogHeader className="px-4 py-4 border-b border-realm-800">
          <p
            data-testid="battle-result-outcome"
            className={`text-lg font-medieval font-bold ${result.won ? 'text-violet-400' : 'text-red-400'}`}
          >
            {result.won ? 'Vitória!' : 'Derrota'}
          </p>
        </DialogHeader>
        <div className="px-4 py-4 space-y-3">
          {result.won && lootEntries.length > 0 && (
            <section>
              <p className="text-xs text-realm-400 mb-2">Saque obtido:</p>
              <ul className="space-y-1">
                {lootEntries.map((k) => (
                  <li key={k} className="text-sm text-white">
                    +{result.lootGained[k]} {k}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {!result.won && lostEntries.length > 0 && (
            <section>
              <p className="text-xs text-realm-400 mb-2">Unidades perdidas:</p>
              <ul className="space-y-1">
                {lostEntries.map((id) => (
                  <li key={id} className="text-sm text-red-400">
                    −{result.unitsSent[id]} {UNIT_DEFINITIONS[id].name}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
        <DialogFooter className="mx-0 mb-0 px-4 py-3 border-t border-realm-800">
          <button
            data-testid="battle-result-dismiss"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium bg-realm-800 hover:bg-realm-700 text-white"
          >
            Fechar
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
