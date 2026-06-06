import { Page } from '@playwright/test';

const IDS = ['castle', 'farm', 'sawmill', 'mine', 'market', 'barracks', 'prefeitura'];

export function makeState(overrides: Record<string, unknown> = {}) {
  const buildings = Object.fromEntries(
    IDS.map((id) => [id, { id, level: id === 'castle' ? 1 : id === 'barracks' ? 1 : 0 }])
  );
  return JSON.stringify({
    version: 2,
    castleGoldRate: 0,
    lastSavedAt: Date.now(),
    militaryUnits: { warrior: 5, archer: 0, lancer: 0 },
    trainingQueue: [],
    defeatedEnemies: [],
    resources: {
      current: { wood: 500, stone: 500, food: 200, gold: 50 },
      max: { wood: 1000, stone: 1000, food: 1000, gold: 1000 },
    },
    buildings,
    buildQueue: [],
    ...overrides,
  });
}

export async function injectState(page: Page, overrides: Record<string, unknown> = {}) {
  await page.addInitScript(
    (str: string) => localStorage.setItem('galadur-state', str),
    makeState(overrides)
  );
  await page.goto('/');
}
