import { test, expect } from '@playwright/test';

test.describe('Mobile Resource HUD', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test('os quatro recursos estão visíveis no formato compacto', async ({ page }) => {
    const mobileGrid = page.locator('header > div.grid.grid-cols-4');
    await expect(mobileGrid).toBeVisible();
    const cells = mobileGrid.locator('> div');
    await expect(cells).toHaveCount(4);
  });

  test('botões de velocidade estão presentes e clicáveis', async ({ page }) => {
    await expect(page.getByRole('button', { name: '1x' })).toBeVisible();
    await page.getByRole('button', { name: '2x' }).click();
    await expect(page.getByRole('button', { name: '2x' })).toBeVisible();
  });

  test('day counter está visível', async ({ page }) => {
    await expect(page.getByText('Dia').first()).toBeVisible();
  });

  test('sem overflow horizontal na ResourceHUD em 390px', async ({ page }) => {
    const header = page.locator('header').first();
    const hasOverflow = await header.evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(hasOverflow).toBe(false);
  });
});
