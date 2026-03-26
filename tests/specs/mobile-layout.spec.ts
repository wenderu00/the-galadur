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

  test('bottom nav está visível em 390px', async () => {
    expect(await nav.isBottomNavVisible()).toBe(true);
  });

  test('sidebar e painel direito estão ocultos em 390px', async () => {
    expect(await nav.isDesktopSidebarVisible()).toBe(false);
    expect(await nav.isDesktopSummaryVisible()).toBe(false);
  });

  test('aba Navegação exibe itens de navegação', async ({ page }) => {
    await nav.goToNavigation();
    await expect(page.getByText('Cidade').filter({ visible: true }).first()).toBeVisible();
  });

  test('aba Resumo exibe o painel de resumo', async ({ page }) => {
    await nav.goToSummary();
    await expect(page.getByText('Status do Império').filter({ visible: true }).first()).toBeVisible();
  });

  test('aba Edifícios exibe o building grid', async () => {
    await nav.goToNavigation();
    await nav.goToBuildings();
    await expect(nav['page'].locator('article').first()).toBeVisible();
  });

  test('em 768px+ bottom nav está oculta e sidebar é visível', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const desktopNav = new MobileNavPage(page);
    expect(await desktopNav.isBottomNavVisible()).toBe(false);
    expect(await desktopNav.isDesktopSidebarVisible()).toBe(true);
    expect(await desktopNav.isDesktopSummaryVisible()).toBe(true);
  });

  test('sem scroll horizontal em 390px', async ({ page }) => {
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(hasOverflow).toBe(false);
  });
});
