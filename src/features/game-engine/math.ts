import type { ResourceAmount, ResourceKind } from './types';

export const RESOURCE_KINDS: ResourceKind[] = ['wood', 'stone', 'food', 'gold'];

export function zeroAmount(): ResourceAmount {
  return { wood: 0, stone: 0, food: 0, gold: 0 };
}

export function addAmounts(a: ResourceAmount, b: Partial<ResourceAmount>): ResourceAmount {
  return {
    wood: a.wood + (b.wood ?? 0),
    stone: a.stone + (b.stone ?? 0),
    food: a.food + (b.food ?? 0),
    gold: a.gold + (b.gold ?? 0),
  };
}

export function subtractAmounts(a: ResourceAmount, b: ResourceAmount): ResourceAmount {
  return {
    wood: a.wood - b.wood,
    stone: a.stone - b.stone,
    food: a.food - b.food,
    gold: a.gold - b.gold,
  };
}

export function clampToMax(amount: ResourceAmount, cap: ResourceAmount): ResourceAmount {
  return {
    wood: Math.min(amount.wood, cap.wood),
    stone: Math.min(amount.stone, cap.stone),
    food: Math.min(amount.food, cap.food),
    gold: Math.min(amount.gold, cap.gold),
  };
}

export function scaleAmount(amount: ResourceAmount, multiplier: number): ResourceAmount {
  return {
    wood: amount.wood * multiplier,
    stone: amount.stone * multiplier,
    food: amount.food * multiplier,
    gold: amount.gold * multiplier,
  };
}

export function canAfford(current: ResourceAmount, cost: ResourceAmount): boolean {
  return RESOURCE_KINDS.every((kind) => current[kind] >= cost[kind]);
}

export function deductCost(current: ResourceAmount, cost: ResourceAmount): ResourceAmount {
  const result = subtractAmounts(current, cost);
  return {
    wood: Math.max(0, result.wood),
    stone: Math.max(0, result.stone),
    food: Math.max(0, result.food),
    gold: Math.max(0, result.gold),
  };
}
