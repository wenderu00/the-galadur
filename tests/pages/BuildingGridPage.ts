import { Page, Locator } from '@playwright/test';

export class BuildingGridPage {
  constructor(private readonly page: Page) {}

  async resetState() {
    await this.page.evaluate(() => localStorage.clear());
    await this.page.reload();
  }

  private cards(): Locator {
    return this.page.locator('main ul li article');
  }

  async cardCount(): Promise<number> {
    return this.cards().count();
  }

  cardByName(name: string): Locator {
    return this.cards().filter({ has: this.page.locator('h3', { hasText: name }) });
  }

  async getLevelText(name: string): Promise<string> {
    return (await this.cardByName(name).locator('p', { hasText: /^Nível/ }).textContent()) ?? '';
  }

  async clickCard(name: string): Promise<void> {
    await this.cardByName(name).click();
  }
}
