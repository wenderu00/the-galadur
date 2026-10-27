import { test, expect } from '@playwright/test';
import { ThemePage } from '../pages/ThemePage';

test.describe('Tema', () => {
  let theme: ThemePage;

  test.beforeEach(async ({ page }) => {
    theme = new ThemePage(page);
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('escolher claro aplica o tema claro', async () => {
    await theme.choose('claro');
    await expect(theme.root()).toHaveAttribute('data-theme', 'light');
  });

  test('a escolha de tema sobrevive ao recarregar', async ({ page }) => {
    await theme.choose('escuro');
    await page.reload();
    await expect(theme.root()).toHaveAttribute('data-theme', 'dark');
  });

  test('voltar para sistema remove o tema forçado', async () => {
    await theme.choose('claro');
    await theme.choose('sistema');
    await expect(theme.root()).not.toHaveAttribute('data-theme');
  });
});
