import { useCallback, useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { gameStateAtom, tickCountAtom, gameSpeedAtom } from '@/store/gameAtoms';
import { eventLogAtom } from '@/store/eventLogAtom';
import {
  tick,
  calculateOfflineProgress,
  rescaleQueueForSpeedChange,
} from '@/features/game-engine/engine';
import {
  processCompletedTraining,
  rescaleTrainingQueue,
} from '@/features/game-engine/military-engine';
import { BUILDING_DEFINITIONS } from '@/config/buildings';
import { UNIT_DEFINITIONS } from '@/config/units';

const TICK_INTERVAL_MS = 1_000;

export function useGameLoop(): void {
  const offlineAppliedRef = useRef(false);
  const prevSpeedRef = useRef<number>(1);
  const [speed] = useAtom(gameSpeedAtom);

  const applyOffline = useAtomCallback(
    useCallback((get, set) => {
      const now = Date.now();
      const afterOffline = calculateOfflineProgress(get(gameStateAtom), now);
      const { state: afterTraining } = processCompletedTraining(afterOffline, now);
      set(gameStateAtom, afterTraining);
    }, []),
  );

  const runTick = useAtomCallback(
    useCallback((get, set) => {
      const now = Date.now();
      const prev = get(gameStateAtom);
      const completedBuildings = prev.buildQueue.filter((e) => e.completesAt <= now);
      const completedTraining = prev.trainingQueue.filter((e) => e.completesAt <= now);

      const afterTick = tick(prev, now);
      const { state: afterTraining } = processCompletedTraining(afterTick, now);
      set(gameStateAtom, afterTraining);
      set(tickCountAtom, (n) => n + 1);

      if (completedBuildings.length > 0) {
        set(eventLogAtom, (log) => [
          ...log,
          ...completedBuildings.map((e) => ({
            timestamp: now,
            message: `${BUILDING_DEFINITIONS[e.buildingId].name} atingiu Nível ${e.targetLevel}!`,
          })),
        ]);
      }
      if (completedTraining.length > 0) {
        set(eventLogAtom, (log) => [
          ...log,
          ...completedTraining.map((e) => ({
            timestamp: now,
            message: `${UNIT_DEFINITIONS[e.unitId].name} treinado com sucesso!`,
          })),
        ]);
      }
    }, []),
  );

  const applySpeedChange = useAtomCallback(
    useCallback((get, set, oldSpeed: number, newSpeed: number) => {
      const now = Date.now();
      const after = rescaleQueueForSpeedChange(get(gameStateAtom), now, oldSpeed, newSpeed);
      set(gameStateAtom, rescaleTrainingQueue(after, now, oldSpeed, newSpeed));
    }, []),
  );

  useEffect(() => {
    if (offlineAppliedRef.current) return;
    offlineAppliedRef.current = true;
    applyOffline();
  }, [applyOffline]);

  useEffect(() => {
    const oldSpeed = prevSpeedRef.current;
    if (oldSpeed !== speed) {
      if (oldSpeed > 0 && speed > 0) {
        applySpeedChange(oldSpeed, speed);
      }
      prevSpeedRef.current = speed;
    }
  }, [speed, applySpeedChange]);

  useEffect(() => {
    if (speed === 0) return;
    const intervalId = setInterval(runTick, TICK_INTERVAL_MS / speed);
    return () => clearInterval(intervalId);
  }, [runTick, speed]);
}
