import { useEffect, useRef } from 'react';
import { useSetAtom } from 'jotai';
import { gameStateAtom } from '@/store/gameAtoms';
import { tick, calculateOfflineProgress } from '@/features/game-engine/engine';

const TICK_INTERVAL_MS = 1_000;

export function useGameLoop(): void {
  const setGameState = useSetAtom(gameStateAtom);
  const offlineAppliedRef = useRef(false);

  useEffect(() => {
    if (offlineAppliedRef.current) return;
    offlineAppliedRef.current = true;

    const now = Date.now();
    setGameState((prev) => calculateOfflineProgress(prev, now));
  }, [setGameState]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setGameState((prev) => tick(prev, Date.now()));
    }, TICK_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [setGameState]);
}
