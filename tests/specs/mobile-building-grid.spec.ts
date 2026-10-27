import { test, expect } from '@playwright/test';
import { BuildingGridPage } from '../pages/BuildingGridPage';
import { BuildingModalPage } from '../pages/BuildingModalPage';

test.describe('Mobile Building Grid', () => {
  let grid: BuildingGridPage;
  let modal: BuildingModalPage;

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    grid = new BuildingGridPage(page);
    modal = new BuildingModalPage(page);
    await page.goto('/');
    await grid.resetState();
  });

  test('exibe 1 coluna de cards em 390px', async () => {
    const firstCard = grid.cards().first();
    const viewportWidth = 390;
    const cardWidth = await firstCard.evaluate((el) => el.getBoundingClientRect().width);
    expect(cardWidth).toBeGreaterThan(viewportWidth * 0.7);
  });

  test('modal ocupa ≥ 90% da largura em 390px', async () => {
    await grid.clickCard('Castelo');
    await expect(modal.dialog).toBeVisible();
    const dialogWidth = await modal.dialog.evaluate((el) => (el as HTMLElement).offsetWidth);
    expect(dialogWidth).toBeGreaterThanOrEqual(390 * 0.9);
  });

  test('fechar modal via botão Fechar funciona em mobile', async () => {
    await grid.clickCard('Castelo');
    await expect(modal.dialog).toBeVisible();
    await modal.close();
    await expect(modal.dialog).not.toBeVisible();
  });

  test('botão de upgrade no modal tem área de toque ≥ 44px', async () => {
    await grid.clickCard('Castelo');
    await expect(modal.dialog).toBeVisible();
    const upgradeBtn = modal.upgradeButton();
    const height = await upgradeBtn.evaluate((el) => (el as HTMLElement).offsetHeight);
    expect(height).toBeGreaterThanOrEqual(44);
  });

  test('botão de upgrade está desabilitado sem recursos suficientes', async () => {
    await grid.clickCard('Castelo');
    await expect(modal.dialog).toBeVisible();
    expect(await modal.isUpgradeDisabled()).toBe(true);
  });
});
