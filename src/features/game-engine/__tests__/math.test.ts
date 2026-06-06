import { describe, test, expect } from 'vitest';
import { canAfford, deductCost } from '../math';

describe('canAfford', () => {
  test('returns true when all resources meet or exceed the cost', () => {
    const resources = { wood: 100, stone: 50, food: 30, gold: 10 };
    const cost = { wood: 50, stone: 50, food: 20, gold: 5 };
    expect(canAfford(resources, cost)).toBe(true);
  });

  test('returns false when any resource falls short', () => {
    const resources = { wood: 10, stone: 50, food: 30, gold: 10 };
    const cost = { wood: 50, stone: 50, food: 20, gold: 5 };
    expect(canAfford(resources, cost)).toBe(false);
  });

  test('returns true when resources exactly equal the cost', () => {
    const cost = { wood: 40, stone: 50, food: 15, gold: 0 };
    expect(canAfford(cost, cost)).toBe(true);
  });
});

describe('deductCost', () => {
  test('subtracts the cost from current resources', () => {
    const current = { wood: 100, stone: 80, food: 60, gold: 20 };
    const cost = { wood: 40, stone: 50, food: 15, gold: 0 };
    expect(deductCost(current, cost)).toEqual({ wood: 60, stone: 30, food: 45, gold: 20 });
  });

  test('clamps to zero and never returns negative values', () => {
    const current = { wood: 10, stone: 80, food: 60, gold: 20 };
    const cost = { wood: 40, stone: 0, food: 0, gold: 0 };
    expect(deductCost(current, cost).wood).toBe(0);
  });
});
