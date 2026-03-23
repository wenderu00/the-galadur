import { test, expect } from '@playwright/test';
import { BuildingGridPage } from '../pages/BuildingGridPage';
import { BuildingModalPage } from '../pages/BuildingModalPage';

test.describe('BuildingModal', () => {
  let grid: BuildingGridPage;
  let modal: BuildingModalPage;

  test.beforeEach(async ({ page }) => {
    grid = new BuildingGridPage(page);
    modal = new BuildingModalPage(page);
    await page.goto('/');
    await grid.resetState();
  });

  test('abre o modal do Castelo com nome Castelo e nível 1', async () => {
    await grid.clickCard('Castelo');
    expect(await modal.getName()).toBe('Castelo');
    expect(await modal.getLevel()).toContain('Nível 1');
  });

  test('abre o modal da Fazenda com nome Fazenda e nível 0', async () => {
    await grid.clickCard('Fazenda');
    expect(await modal.getName()).toBe('Fazenda');
    expect(await modal.getLevel()).toContain('Nível 0');
  });

  test('modal do Castelo exibe os custos do nível 2', async () => {
    await grid.clickCard('Castelo');
    await expect(modal.dialog).toContainText('40 Madeira');
    await expect(modal.dialog).toContainText('50 Pedra');
    await expect(modal.dialog).toContainText('15 Comida');
  });

  test('botão de upgrade está desabilitado com recursos insuficientes', async () => {
    await grid.clickCard('Castelo');
    expect(await modal.isUpgradeDisabled()).toBe(true);
  });

  test('fechar modal via botão Fechar faz o modal desaparecer', async ({ page }) => {
    await grid.clickCard('Castelo');
    await modal.close();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('fechar modal via clique fora do dialog faz o modal desaparecer', async ({ page }) => {
    await grid.clickCard('Castelo');
    await modal.closeByOverlay();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });
});
