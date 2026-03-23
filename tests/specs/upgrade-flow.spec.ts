import { test, expect, Page } from '@playwright/test';
import { BuildingGridPage } from '../pages/BuildingGridPage';
import { BuildingModalPage } from '../pages/BuildingModalPage';
import { SummaryPanelPage } from '../pages/SummaryPanelPage';

const IDS = ['castle', 'farm', 'sawmill', 'mine', 'market', 'barracks', 'prefeitura'];

async function injectState(page: Page, extra: Record<string, unknown> = {}): Promise<void> {
  const bldgs = Object.fromEntries(IDS.map((id) => [id, { id, level: id === 'castle' ? 1 : 0 }]));
  const s = JSON.stringify({ version: 1, castleGoldRate: 0, lastSavedAt: Date.now(), buildings: bldgs, buildQueue: [],
    resources: { current: { wood: 150, stone: 150, food: 150, gold: 0 }, max: { wood: 200, stone: 200, food: 200, gold: 100 } }, ...extra });
  await page.addInitScript((str: string) => localStorage.setItem('galadur-state', str), s);
  await page.reload();
}

test.describe('UpgradeFlow', () => {
  let grid: BuildingGridPage;
  let modal: BuildingModalPage;
  let panel: SummaryPanelPage;

  test.beforeEach(async ({ page }) => {
    grid = new BuildingGridPage(page);
    modal = new BuildingModalPage(page);
    panel = new SummaryPanelPage(page);
    await page.goto('/');
    await grid.resetState();
  });

  test('botão desabilitado sem recursos', async () => {
    await grid.clickCard('Castelo');
    expect(await modal.isUpgradeDisabled()).toBe(true);
  });

  test.describe('com recursos suficientes', () => {
    test.beforeEach(({ page }) => injectState(page));

    test('botão habilitado', async () => {
      await grid.clickCard('Castelo');
      expect(await modal.isUpgradeEnabled()).toBe(true);
    });

    test('modal fecha após upgrade', async () => {
      await grid.clickCard('Castelo');
      await modal.clickUpgrade();
      await expect(modal.dialog).not.toBeVisible();
    });

    test('Castelo entra na fila de construção', async () => {
      await grid.clickCard('Castelo');
      await modal.clickUpgrade();
      expect(await panel.queueItemCount()).toBe(1);
      expect(await panel.getQueueItemName(0)).toContain('Castelo');
    });

    test('Total de Construções permanece 1', async () => {
      await grid.clickCard('Castelo');
      await modal.clickUpgrade();
      await expect(modal.dialog).not.toBeVisible();
      expect(await panel.getTotalBuildings()).toBe('1');
    });
  });

  test.describe('após construção concluída', () => {
    test.beforeEach(async ({ page }) => {
      const past = Date.now() - 120_000;
      const entry = [{ buildingId: 'castle', targetLevel: 2, startedAt: past, completesAt: past + 45_000 }];
      await injectState(page, { buildQueue: entry, lastSavedAt: past });
      await expect(grid.cardByName('Castelo').locator('p', { hasText: /^Nível 2/ })).toBeVisible({ timeout: 5000 });
    });

    test('Castelo está no nível 2', async () => {
      expect(await grid.getLevelText('Castelo')).toContain('Nível 2');
    });

    test('Pontuação do Império é 60', async () => {
      expect(await panel.getEmpireScore()).toBe('60');
    });
  });
});
