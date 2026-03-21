import { useCallback } from 'react';
import { useAtomCallback } from 'jotai/utils';
import { gameStateAtom, gameSpeedAtom } from '@/store/gameAtoms';
import { eventLogAtom } from '@/store/eventLogAtom';
import { startConstruction } from '@/features/game-engine/engine';
import { BUILDING_DEFINITIONS } from '@/config/buildings';
import type { BuildingId, ConstructionResult } from '../types';

export function useUpgrade(): (buildingId: BuildingId) => ConstructionResult {
  return useAtomCallback(
    useCallback((get, set, buildingId: BuildingId): ConstructionResult => {
      const now = Date.now();
      const state = get(gameStateAtom);
      const speed = get(gameSpeedAtom);
      const result = startConstruction(state, buildingId, now, speed);

      if (result.success) {
        set(gameStateAtom, result.state);
        const targetLevel = state.buildings[buildingId].level + 1;
        set(eventLogAtom, (log) => [
          ...log,
          {
            timestamp: now,
            message: `Construção de ${BUILDING_DEFINITIONS[buildingId].name} Nível ${targetLevel} iniciada.`,
          },
        ]);
      }

      return result;
    }, []),
  );
}
