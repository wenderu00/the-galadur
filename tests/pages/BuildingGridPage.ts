import { Page, Locator } from '@playwright/test';

export class BuildingGridPage {
  constructor(private readonly page: Page) {}

  async resetState() {
    await this.page.evaluate(() => localStorage.clear());
    await this.page.reload();
  }

  async cardCount(): Promise<number> {
    return this.page.locator('article[data-testid^="building-card-"]').count();
  }

  cardByName(name: string): Locator {
    return this.page
      .locator('article[data-testid^="building-card-"]')
      .filter({ has: this.page.locator('h3', { hasText: name }) });
  }

  async getLevelText(name: string): Promise<string> {
    return (await this.cardByName(name).locator('[data-testid$="-level"]').textContent()) ?? '';
  }

  async clickCard(name: string): Promise<void> {
    await this.cardByName(name).click();
  }
}
