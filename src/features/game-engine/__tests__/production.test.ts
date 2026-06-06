import { describe, test, expect } from 'vitest';
import { calculateProduction, calculateStorageCaps } from '../production';
import { createInitialGameState } from '../engine';

describe('calculateProduction', () => {
  test('castle level 1 produces expected resources per tick', () => {
    const { buildings } = createInitialGameState();
    expect(calculateProduction(buildings)).toEqual({ wood: 0.5, stone: 0.3, food: 0.3, gold: 0 });
  });

  test('overriding gold rate produces the given gold value per tick', () => {
    const { buildings } = createInitialGameState();
    expect(calculateProduction(buildings, 2).gold).toBe(2);
  });
});

describe('calculateStorageCaps', () => {
  test('castle level 1 sets the initial storage caps', () => {
    const { buildings } = createInitialGameState();
    expect(calculateStorageCaps(buildings)).toEqual({
      wood: 200,
      stone: 200,
      food: 200,
      gold: 100,
    });
  });
});
