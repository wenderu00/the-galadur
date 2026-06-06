import { describe, test, expect } from 'vitest';
import { executeTrade } from '../trade';
import { createInitialGameState } from '../engine';
import type { GameState } from '../types';

const NOW = 1000000;

function stateWithMarket(level: 0 | 1 | 2 | 3, gold = 100, wood = 50): GameState {
  const base = createInitialGameState(NOW);
  return {
    ...base,
    buildings: { ...base.buildings, market: { id: 'market', level } },
    resources: {
      ...base.resources,
      current: { ...base.resources.current, gold, wood },
    },
  };
}

describe('executeTrade', () => {
  test('fails with market_not_built when market is at level 0', () => {
    expect(executeTrade(stateWithMarket(0), 'buy', 'wood', 10)).toMatchObject({
      error: 'market_not_built',
    });
  });

  test('buy: deducts gold and adds resource at level 1 rates', () => {
    const result = executeTrade(stateWithMarket(1, 100, 50), 'buy', 'wood', 10);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.state.resources.current.gold).toBe(90);
      expect(result.state.resources.current.wood).toBe(60);
    }
  });

  test('sell: deducts resource and adds gold at level 1 rates', () => {
    const result = executeTrade(stateWithMarket(1, 0, 50), 'sell', 'wood', 10);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.state.resources.current.wood).toBe(40);
      expect(result.state.resources.current.gold).toBe(10);
    }
  });

  test('buy: fails with cannot_afford when gold is insufficient', () => {
    expect(executeTrade(stateWithMarket(1, 5, 50), 'buy', 'wood', 10)).toMatchObject({
      error: 'cannot_afford',
    });
  });

  test('sell: fails with cannot_afford when resource is insufficient', () => {
    expect(executeTrade(stateWithMarket(1, 0, 5), 'sell', 'wood', 10)).toMatchObject({
      error: 'cannot_afford',
    });
  });

  test('buy: fails with storage_full when resource would exceed max', () => {
    const base = createInitialGameState(NOW);
    const state: GameState = {
      ...base,
      buildings: { ...base.buildings, market: { id: 'market', level: 1 } },
      resources: {
        current: { ...base.resources.current, gold: 100, wood: base.resources.max.wood },
        max: base.resources.max,
      },
    };
    expect(executeTrade(state, 'buy', 'wood', 1)).toMatchObject({ error: 'storage_full' });
  });

  test('level 3 market: buying 10 wood costs only 5 gold (double buying power)', () => {
    const result = executeTrade(stateWithMarket(3, 100, 50), 'buy', 'wood', 10);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.state.resources.current.gold).toBe(95);
      expect(result.state.resources.current.wood).toBe(60);
    }
  });

  test('stone costs 2x more than wood (base price reflects scarcity)', () => {
    const base = createInitialGameState(NOW);
    const state: GameState = {
      ...base,
      buildings: { ...base.buildings, market: { id: 'market', level: 1 } },
      resources: {
        current: { ...base.resources.current, gold: 100, stone: 10 },
        max: { ...base.resources.max, stone: 500 },
      },
    };
    const result = executeTrade(state, 'buy', 'stone', 10);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.state.resources.current.gold).toBe(80);
      expect(result.state.resources.current.stone).toBe(20);
    }
  });
});
