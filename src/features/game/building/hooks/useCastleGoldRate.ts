import { useAtomValue } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { useCallback } from 'react';
import { gameStateAtom, castleGoldRateAtom, buildingsAtom } from '@/store/gameAtoms';
import { getBuildingLevelDef } from '@/config/buildings';
import type { BuildingLevel } from '@/features/game-engine/types';

export function useCastleGoldRate() {
  const rate = useAtomValue(castleGoldRateAtom);
  const buildings = useAtomValue(buildingsAtom);
  const castleLevel = buildings['castle'].level;

  const maxRate =
    castleLevel === 0
      ? 0
      : (getBuildingLevelDef('castle', castleLevel as Exclude<BuildingLevel, 0>)
          .effects.productionPerTick.gold ?? 0);

  const setRate = useAtomCallback(
    useCallback(
      (get, set, newRate: number) => {
        set(gameStateAtom, { ...get(gameStateAtom), castleGoldRate: newRate });
      },
      [],
    ),
  );

  return { rate, maxRate, setRate };
}
