import { useAtomValue } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { useCallback } from 'react';
import { gameStateAtom, buildingsAtom, resourcesAtom } from '@/store/gameAtoms';
import { executeTrade, getTradePreview } from '@/features/game-engine/engine';
import type { TradeDirection, TradeResource } from '@/features/game-engine/engine';
import type { ResourceStore } from '@/features/game-engine/types';

export interface MarketTradeState {
  marketLevel: number;
  resources: ResourceStore;
  preview: (resource: TradeResource, amount: number) => { goldCost: number; goldGained: number };
  trade: (direction: TradeDirection, resource: TradeResource, amount: number) => void;
}

export function useMarketTrade(): MarketTradeState {
  const buildings = useAtomValue(buildingsAtom);
  const resources = useAtomValue(resourcesAtom);
  const marketLevel = buildings['market'].level;

  const preview = useCallback(
    (resource: TradeResource, amount: number) => {
      if (marketLevel === 0) return { goldCost: 0, goldGained: 0 };
      return getTradePreview(resource, amount, marketLevel as 1 | 2 | 3);
    },
    [marketLevel]
  );

  const trade = useAtomCallback(
    useCallback((get, set, direction: TradeDirection, resource: TradeResource, amount: number) => {
      const result = executeTrade(get(gameStateAtom), direction, resource, amount);
      if (result.success) set(gameStateAtom, result.state);
    }, [])
  );

  return { marketLevel, resources, preview, trade };
}
