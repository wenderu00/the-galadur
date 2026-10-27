import { test, expect } from '@playwright/test';
import { MobileNavPage } from '../pages/MobileNavPage';

test.describe('Mobile Layout', () => {
  let nav: MobileNavPage;

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    nav = new MobileNavPage(page);
    await page.goto('/');
    await nav.resetState();
  });

  test('navegação inferior é a única visível em 390px', async () => {
    await expect(nav.sidebar()).toBeHidden();
    await expect(nav.visibleNavs()).toHaveCount(1);
    await expect(nav.visibleNavs().getByRole('button', { name: 'Cidade' })).toBeVisible();
  });

  test('resumo aparece dentro da página, abaixo do conteúdo', async () => {
    await expect(nav.summary()).toBeVisible();
    expect(await nav.isSummaryBelowContent()).toBe(true);
  });

  test('aba Exército exibe a página do exército', async ({ page }) => {
    await nav.goTo('Exército');
    await expect(page.getByTestId('army-page')).toBeVisible();
  });

  test('aba Cidade volta para a grade de edifícios', async ({ page }) => {
    await nav.goTo('Exército');
    await nav.goTo('Cidade');
    await expect(page.getByTestId('building-card-castle')).toBeVisible();
  });

  test('em 768px só a navegação da sidebar fica visível', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(nav.sidebarNav()).toBeVisible();
    await expect(nav.visibleNavs()).toHaveCount(1);
  });

  test('em 1280px o resumo fica ao lado do conteúdo', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(nav.summary()).toBeVisible();
    expect(await nav.isSummaryBesideContent()).toBe(true);
  });

  test('sem scroll horizontal em 390px', async ({ page }) => {
    await expect(nav.summary()).toBeVisible();
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(hasOverflow).toBe(false);
  });
});
