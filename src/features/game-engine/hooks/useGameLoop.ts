import { useCallback, useEffect, useRef } from 'react';
import { useAtomCallback } from 'jotai/utils';
import { gameStateAtom, tickCountAtom, gameSpeedAtom } from '@/store/gameAtoms';
import { eventLogAtom } from '@/store/eventLogAtom';
import { tick, calculateOfflineProgress } from '@/features/game-engine/engine';
import { BUILDING_DEFINITIONS } from '@/config/buildings';

const TICK_INTERVAL_MS = 1_000;

export function useGameLoop(): void {
  const offlineAppliedRef = useRef(false);

  const applyOffline = useAtomCallback(
    useCallback((get, set) => {
      const now = Date.now();
      set(gameStateAtom, calculateOfflineProgress(get(gameStateAtom), now));
    }, []),
  );

  const runTick = useAtomCallback(
    useCallback((get, set) => {
      const speed = get(gameSpeedAtom);
      if (speed === 0) return;

      const now = Date.now();
      const prev = get(gameStateAtom);
      const completedNow = prev.buildQueue.filter((e) => e.completesAt <= now);

      set(gameStateAtom, tick(prev, now));
      set(tickCountAtom, (n) => n + 1);

      if (completedNow.length > 0) {
        set(eventLogAtom, (log) => [
          ...log,
          ...completedNow.map((e) => ({
            timestamp: now,
            message: `${BUILDING_DEFINITIONS[e.buildingId].name} atingiu Nível ${e.targetLevel}!`,
          })),
        ]);
      }
    }, []),
  );

  useEffect(() => {
    if (offlineAppliedRef.current) return;
    offlineAppliedRef.current = true;
    applyOffline();
  }, [applyOffline]);

  useEffect(() => {
    const intervalId = setInterval(runTick, TICK_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [runTick]);
}
