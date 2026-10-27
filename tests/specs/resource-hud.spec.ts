import { test, expect } from '@playwright/test';
import { ResourceHUDPage } from '../pages/ResourceHUDPage';

test.describe('ResourceHUD', () => {
  let hud: ResourceHUDPage;

  test.beforeEach(async ({ page }) => {
    hud = new ResourceHUDPage(page);
    await page.goto('/');
    await hud.resetState();
  });

  test('os quatro recursos estão visíveis no carregamento', async () => {
    for (const kind of ['wood', 'stone', 'food', 'gold'] as const) {
      await expect(hud.meter(kind)).toBeVisible();
    }
  });

  test('madeira começa com 50 unidades', async () => {
    await expect(hud.meter('wood')).toBeVisible();
    expect(await hud.getResourceValue('wood')).toBe(50);
  });

  test('pedra começa com 30 unidades', async () => {
    await expect(hud.meter('stone')).toBeVisible();
    expect(await hud.getResourceValue('stone')).toBe(30);
  });

  test('comida começa com 20 unidades', async () => {
    await expect(hud.meter('food')).toBeVisible();
    expect(await hud.getResourceValue('food')).toBe(20);
  });

  test('ouro começa com 0 unidades', async () => {
    await expect(hud.meter('gold')).toBeVisible();
    expect(await hud.getResourceValue('gold')).toBe(0);
  });

  test('taxa de produção de madeira exibe +0,5/s', async () => {
    await expect(hud.rate('wood')).toHaveText('+0,5/s');
  });

  test('contador de dias começa no dia 1', async () => {
    await expect(hud.dayValue()).toHaveText('1');
  });
});
