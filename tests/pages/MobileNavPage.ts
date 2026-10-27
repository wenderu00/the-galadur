import { Page, Locator } from '@playwright/test';

type Box = { x: number; y: number; width: number; height: number };

export class MobileNavPage {
  constructor(private readonly page: Page) {}

  async resetState(): Promise<void> {
    await this.page.evaluate(() => localStorage.clear());
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
  }

  visibleNavs(): Locator {
    return this.page.getByRole('navigation', { name: 'Principal' });
  }

  sidebar(): Locator {
    return this.page.getByTestId('desktop-sidebar');
  }

  sidebarNav(): Locator {
    return this.sidebar().getByRole('navigation', { name: 'Principal' });
  }

  summary(): Locator {
    return this.page.getByTestId('summary-panel');
  }

  async goTo(label: 'Cidade' | 'Exército'): Promise<void> {
    await this.visibleNavs().getByRole('button', { name: label }).click();
  }

  private async boxes(): Promise<{ main: Box; summary: Box } | null> {
    const main = await this.page.getByRole('main').boundingBox();
    const summary = await this.summary().boundingBox();
    if (main === null || summary === null) return null;
    return { main, summary };
  }

  async isSummaryBelowContent(): Promise<boolean> {
    const found = await this.boxes();
    return found !== null && found.summary.y >= found.main.y + found.main.height - 1;
  }

  async isSummaryBesideContent(): Promise<boolean> {
    const found = await this.boxes();
    return found !== null && found.summary.x >= found.main.x + found.main.width - 1;
  }
}
