import { Page, Locator } from '@playwright/test';

export class MobileNavPage {
  constructor(private readonly page: Page) {}

  async resetState(): Promise<void> {
    await this.page.evaluate(() => localStorage.clear());
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
  }

  private bottomNav(): Locator {
    return this.page.getByTestId('mobile-nav');
  }

  async goToBuildings(): Promise<void> {
    await this.page.getByRole('button', { name: 'Edifícios' }).click();
  }

  async goToNavigation(): Promise<void> {
    await this.page.getByRole('button', { name: 'Navegação' }).click();
  }

  async goToSummary(): Promise<void> {
    await this.page.getByRole('button', { name: 'Resumo' }).click();
  }

  async isBottomNavVisible(): Promise<boolean> {
    return this.bottomNav().isVisible();
  }

  async isDesktopSidebarVisible(): Promise<boolean> {
    return this.page.getByTestId('desktop-sidebar').isVisible();
  }

  async isDesktopSummaryVisible(): Promise<boolean> {
    return this.page.getByTestId('desktop-summary').isVisible();
  }
}
