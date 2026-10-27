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
    const hud = page.getByTestId('game-hud');
    await expect(hud.getByRole('meter')).toHaveCount(4);
    for (const kind of ['wood', 'stone', 'food', 'gold']) {
      await expect(hud.getByTestId(`resource-bar-${kind}-compact`)).toBeVisible();
    }
  });

  test('controles de velocidade estão presentes e clicáveis', async ({ page }) => {
    const speed = page.getByRole('radiogroup', { name: 'Velocidade do jogo' });
    await expect(speed.getByRole('radio', { name: '1x' })).toBeVisible();
    await speed.getByRole('radio', { name: '2x' }).click();
    await expect(speed.getByRole('radio', { name: '2x' })).toBeChecked();
  });

  test('contador de dias está visível', async ({ page }) => {
    await expect(page.getByTestId('game-day-value')).toBeVisible();
  });

  test('sem overflow horizontal no cabeçalho em 390px', async ({ page }) => {
    const hud = page.getByTestId('game-hud');
    await expect(hud).toBeVisible();
    const hasOverflow = await hud.evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(hasOverflow).toBe(false);
  });
});
