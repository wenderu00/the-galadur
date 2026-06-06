import type { GameState, ResourceKind } from './types';

export type TradeResource = Exclude<ResourceKind, 'gold'>;
export type TradeDirection = 'buy' | 'sell';
type TradeError = 'market_not_built' | 'cannot_afford' | 'storage_full';
export type TradeResult =
  | { success: true; state: GameState }
  | { success: false; error: TradeError };

const BASE_PRICES: Record<TradeResource, number> = {
  wood: 1,
  stone: 2,
  food: 1,
};

const EXCHANGE_RATES: Record<1 | 2 | 3, number> = {
  1: 1.0,
  2: 1.5,
  3: 2.0,
};

type ResourceAmount = GameState['resources']['current'];

function tradeSuccess(state: GameState, current: ResourceAmount): TradeResult {
  return { success: true, state: { ...state, resources: { ...state.resources, current } } };
}

export function getTradePreview(
  resource: TradeResource,
  amount: number,
  marketLevel: 1 | 2 | 3
): { goldCost: number; goldGained: number } {
  const goldValue = (amount * BASE_PRICES[resource]) / EXCHANGE_RATES[marketLevel];
  return { goldCost: Math.ceil(goldValue), goldGained: Math.floor(goldValue) };
}

export function executeTrade(
  state: GameState,
  direction: TradeDirection,
  resource: TradeResource,
  amount: number
): TradeResult {
  const marketLevel = state.buildings['market'].level;
  if (marketLevel === 0) return { success: false, error: 'market_not_built' };

  const rate = EXCHANGE_RATES[marketLevel as 1 | 2 | 3];
  const goldValue = (amount * BASE_PRICES[resource]) / rate;
  const { current, max } = state.resources;

  if (direction === 'buy') {
    const goldCost = Math.ceil(goldValue);
    if (current.gold < goldCost) return { success: false, error: 'cannot_afford' };
    if (current[resource] + amount > max[resource])
      return { success: false, error: 'storage_full' };
    return tradeSuccess(state, {
      ...current,
      gold: current.gold - goldCost,
      [resource]: current[resource] + amount,
    });
  }
  const goldGained = Math.floor(goldValue);
  if (current[resource] < amount) return { success: false, error: 'cannot_afford' };
  if (current.gold + goldGained > max.gold) return { success: false, error: 'storage_full' };
  return tradeSuccess(state, {
    ...current,
    gold: current.gold + goldGained,
    [resource]: current[resource] - amount,
  });
}
