import { test, expect, Page } from '@playwright/test';
import { BuildingGridPage } from '../pages/BuildingGridPage';
import { BarracksPage } from '../pages/BarracksPage';

const IDS = ['castle', 'farm', 'sawmill', 'mine', 'market', 'barracks', 'prefeitura'];

function makeState(barracksLevel: 0 | 1 | 2 | 3, overrides: Record<string, unknown> = {}) {
  const buildings = Object.fromEntries(
    IDS.map((id) => {
      const level = id === 'castle' ? 1 : id === 'barracks' ? barracksLevel : 0;
      return [id, { id, level }];
    }),
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
    ...overrides,
  });
}

async function injectState(page: Page, barracksLevel: 0 | 1 | 2 | 3, overrides: Record<string, unknown> = {}) {
  await page.addInitScript(
    (str: string) => localStorage.setItem('galadur-state', str),
    makeState(barracksLevel, overrides),
  );
  await page.reload();
}

test.describe('MilitaryTraining', () => {
  let grid: BuildingGridPage;
  let barracks: BarracksPage;

  test.beforeEach(async ({ page }) => {
    grid = new BuildingGridPage(page);
    barracks = new BarracksPage(page);
    await page.goto('/');
  });

  test('quartel nível 0 mostra mensagem de construção', async () => {
    await grid.resetState();
    await grid.clickCard('Quartel');
    await expect(barracks.notBuiltMessage()).toBeVisible();
  });

  test.describe('quartel nível 1', () => {
    test.beforeEach(({ page }) => injectState(page, 1));

    test('exibe apenas guerreiro', async () => {
      await grid.clickCard('Quartel');
      await expect(barracks.unitCard('Guerreiro')).toBeVisible();
      await expect(barracks.unitCard('Arqueiro')).not.toBeVisible();
      await expect(barracks.unitCard('Lanceiro')).not.toBeVisible();
    });

    test('botão treinar habilitado com recursos suficientes', async () => {
      await grid.clickCard('Quartel');
      await expect(barracks.trainButton('Guerreiro')).toBeEnabled();
    });

    test('iniciar treinamento exibe barra de progresso', async () => {
      await grid.clickCard('Quartel');
      await barracks.clickTrain('Guerreiro');
      await expect(barracks.trainingSection()).toBeVisible();
    });

    test('botão treinar desabilitado enquanto treinamento em curso', async () => {
      await grid.clickCard('Quartel');
      await barracks.clickTrain('Guerreiro');
      await expect(barracks.trainButton('Guerreiro')).toBeDisabled();
    });

    test('botão treinar desabilitado sem recursos', async ({ page }) => {
      await injectState(page, 1, {
        resources: {
          current: { wood: 0, stone: 0, food: 0, gold: 0 },
          max: { wood: 500, stone: 500, food: 500, gold: 500 },
        },
      });
      await grid.clickCard('Quartel');
      await expect(barracks.trainButton('Guerreiro')).toBeDisabled();
    });
  });

  test.describe('quartel nível 2', () => {
    test.beforeEach(({ page }) => injectState(page, 2));

    test('exibe guerreiro e arqueiro', async () => {
      await grid.clickCard('Quartel');
      await expect(barracks.unitCard('Guerreiro')).toBeVisible();
      await expect(barracks.unitCard('Arqueiro')).toBeVisible();
      await expect(barracks.unitCard('Lanceiro')).not.toBeVisible();
    });
  });

  test.describe('quartel nível 3', () => {
    test.beforeEach(({ page }) => injectState(page, 3));

    test('exibe todas as unidades', async () => {
      await grid.clickCard('Quartel');
      await expect(barracks.unitCard('Guerreiro')).toBeVisible();
      await expect(barracks.unitCard('Arqueiro')).toBeVisible();
      await expect(barracks.unitCard('Lanceiro')).toBeVisible();
    });
  });

  test('treino concluído incrementa contador', async ({ page }) => {
    const past = Date.now() - 60_000;
    await injectState(page, 1, {
      militaryUnits: { warrior: 0, archer: 0, lancer: 0 },
      trainingQueue: [{ unitId: 'warrior', startedAt: past, completesAt: past + 30_000 }],
      lastSavedAt: past,
    });
    await grid.clickCard('Quartel');
    await expect(barracks.unitCount('Guerreiro')).toHaveText('×1', { timeout: 5000 });
  });
});
