import { test, expect, Page } from '@playwright/test';
import { BuildingGridPage } from '../pages/BuildingGridPage';
import { BarracksPage } from '../pages/BarracksPage';

const IDS = ['castle', 'farm', 'sawmill', 'mine', 'market', 'barracks', 'prefeitura'];

function makeState(barracksLevel: 1 | 2 | 3) {
  const buildings = Object.fromEntries(
    IDS.map((id) => {
      const level = id === 'castle' ? 1 : id === 'barracks' ? barracksLevel : 0;
      return [id, { id, level }];
    })
  );
  return JSON.stringify({
    version: 2,
    castleGoldRate: 0,
    lastSavedAt: Date.now(),
    militaryUnits: { warrior: 0, archer: 0, lancer: 0 },
    trainingQueue: [],
    resources: {
      current: { wood: 500, stone: 500, food: 500, gold: 500 },
      max: { wood: 500, stone: 500, food: 500, gold: 500 },
    },
    buildings,
    buildQueue: [],
  });
}

async function openBarracks(page: Page, level: 1 | 2 | 3) {
  await page.addInitScript(
    (str: string) => localStorage.setItem('galadur-state', str),
    makeState(level)
  );
  await page.reload();
  const grid = new BuildingGridPage(page);
  await grid.clickCard('Quartel');
}

test.describe('BarracksTrainingSpeed', () => {
  let barracks: BarracksPage;

  test.beforeEach(async ({ page }) => {
    barracks = new BarracksPage(page);
    await page.goto('/');
  });

  test('nível 1 exibe tempo base do guerreiro', async ({ page }) => {
    await openBarracks(page, 1);
    await expect(barracks.unitTrainingTime('Guerreiro')).toHaveText('30s');
  });

  test('nível 2 exibe tempo reduzido do guerreiro', async ({ page }) => {
    await openBarracks(page, 2);
    await expect(barracks.unitTrainingTime('Guerreiro')).toHaveText('24s');
  });

  test('nível 3 exibe tempo reduzido do guerreiro', async ({ page }) => {
    await openBarracks(page, 3);
    await expect(barracks.unitTrainingTime('Guerreiro')).toHaveText('18s');
  });

  test('nível 2 exibe tempo reduzido do arqueiro', async ({ page }) => {
    await openBarracks(page, 2);
    await expect(barracks.unitTrainingTime('Arqueiro')).toHaveText('36s');
  });

  test('nível 3 exibe tempo reduzido do lanceiro', async ({ page }) => {
    await openBarracks(page, 3);
    await expect(barracks.unitTrainingTime('Lanceiro')).toHaveText('36s');
  });
});
