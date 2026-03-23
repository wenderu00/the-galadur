import { test, expect } from '@playwright/test';
import { BuildingGridPage } from '../pages/BuildingGridPage';

const BUILDINGS = ['Castelo', 'Fazenda', 'Serraria', 'Mina', 'Mercado', 'Quartel', 'Prefeitura'];

test.describe('BuildingGrid', () => {
  let grid: BuildingGridPage;

  test.beforeEach(async ({ page }) => {
    grid = new BuildingGridPage(page);
    await page.goto('/');
    await grid.resetState();
  });

  test('exibe 7 cards de edifício no carregamento', async () => {
    expect(await grid.cardCount()).toBe(7);
  });

  test('Castelo aparece com Nível 1', async () => {
    expect(await grid.getLevelText('Castelo')).toContain('Nível 1');
  });

  test('os demais 6 edifícios aparecem com Nível 0', async () => {
    for (const name of BUILDINGS.filter((b) => b !== 'Castelo')) {
      expect(await grid.getLevelText(name)).toContain('Nível 0');
    }
  });

  test('cada card exibe o nome do edifício', async () => {
    for (const name of BUILDINGS) {
      await expect(grid.cardByName(name)).toBeVisible();
    }
  });

  test('clicar em um card abre um modal', async ({ page }) => {
    await grid.clickCard('Castelo');
    await expect(page.getByRole('dialog')).toBeVisible();
  });
});
