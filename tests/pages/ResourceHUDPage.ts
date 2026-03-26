import { Page } from '@playwright/test';

type ResourceKind = 'wood' | 'stone' | 'food' | 'gold';

export class ResourceHUDPage {
  constructor(private readonly page: Page) {}

  async resetState() {
    await this.page.evaluate(() => localStorage.clear());
    await this.page.reload();
  }

  async isResourceVisible(kind: ResourceKind): Promise<boolean> {
    return this.page.getByTestId(`resource-bar-${kind}`).isVisible();
  }

  async getResourceValue(kind: ResourceKind): Promise<number> {
    const text = await this.page
      .getByTestId(`resource-bar-${kind}`)
      .getByTestId(`resource-bar-${kind}-value`)
      .textContent();
    return parseInt(text?.replace(/,/g, '') ?? '0', 10);
  }

  async getProductionRate(kind: ResourceKind): Promise<string> {
    const rate = this.page
      .getByTestId(`resource-bar-${kind}`)
      .getByTestId(`resource-bar-${kind}-rate`);
    if ((await rate.count()) === 0) return '';
    return (await rate.textContent()) ?? '';
  }

  async getDayText(): Promise<string> {
    return (await this.page.locator('header p.font-bold.leading-none').textContent()) ?? '';
  }
}
