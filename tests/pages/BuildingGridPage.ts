import { Page, Locator } from '@playwright/test';

const CARD_TEST_ID = /^building-card-[a-z]+$/;
const LEVEL_TEST_ID = /^building-card-[a-z]+-level$/;

export class BuildingGridPage {
  constructor(private readonly page: Page) {}

  async resetState() {
    await this.page.evaluate(() => localStorage.clear());
    await this.page.reload();
  }

  cards(): Locator {
    return this.page.getByTestId(CARD_TEST_ID);
  }

  cardByName(name: string): Locator {
    return this.cards().filter({ has: this.page.getByRole('heading', { name }) });
  }

  levelOf(name: string): Locator {
    return this.cardByName(name).getByTestId(LEVEL_TEST_ID);
  }

  async getLevelText(name: string): Promise<string> {
    return (await this.levelOf(name).textContent()) ?? '';
  }

  async clickCard(name: string): Promise<void> {
    await this.cardByName(name).getByRole('button', { name, exact: true }).click();
  }
}
