import { useCallback } from 'react';
import { useAtomCallback } from 'jotai/utils';
import { gameStateAtom, gameSpeedAtom } from '@/store/gameAtoms';
import { eventLogAtom } from '@/store/eventLogAtom';
import { startTraining } from '@/features/game-engine/military-engine';
import { UNIT_DEFINITIONS } from '@/config/units';
import type { UnitId } from '@/features/game-engine/military-types';
import type { TrainingResult } from '@/features/game-engine/military-engine';

export function useTraining(): (unitId: UnitId) => TrainingResult {
  return useAtomCallback(
    useCallback((get, set, unitId: UnitId): TrainingResult => {
      const now = Date.now();
      const state = get(gameStateAtom);
      const speed = get(gameSpeedAtom);
      const result = startTraining(state, unitId, now, speed);
      if (result.success) {
        set(gameStateAtom, result.state);
        const unitName = UNIT_DEFINITIONS[unitId].name;
        set(eventLogAtom, (log) => [
          ...log,
          { timestamp: now, message: `Treinamento de ${unitName} iniciado.` },
        ]);
      }
      return result;
    }, []),
  );
}
