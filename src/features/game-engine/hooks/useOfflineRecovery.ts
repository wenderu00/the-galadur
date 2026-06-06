import { useCallback, useEffect, useRef } from 'react';
import { useAtomCallback } from 'jotai/utils';
import { gameStateAtom } from '@/store/gameAtoms';
import { calculateOfflineProgress } from '@/features/game-engine/engine';
import { processCompletedTraining } from '@/features/game-engine/military-engine';

export function useOfflineRecovery(): void {
  const offlineAppliedRef = useRef(false);

  const applyOffline = useAtomCallback(
    useCallback((get, set) => {
      const now = Date.now();
      const afterOffline = calculateOfflineProgress(get(gameStateAtom), now);
      const { state: afterTraining } = processCompletedTraining(afterOffline, now);
      set(gameStateAtom, afterTraining);
    }, [])
  );

  useEffect(() => {
    if (offlineAppliedRef.current) return;
    offlineAppliedRef.current = true;
    applyOffline();
  }, [applyOffline]);
}
