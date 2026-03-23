import { Page } from '@playwright/test';

type ResourceKind = 'wood' | 'stone' | 'food' | 'gold';

const RESOURCE_INDEX: Record<ResourceKind, number> = {
  wood: 1,
  stone: 2,
  food: 3,
  gold: 4,
};

export class ResourceHUDPage {
  constructor(private readonly page: Page) {}

  async resetState() {
    await this.page.evaluate(() => localStorage.clear());
    await this.page.reload();
  }

  private resourceBar(kind: ResourceKind) {
    return this.page.locator(
      `header > div:first-child > div:nth-child(${RESOURCE_INDEX[kind]})`
    );
  }

  async isResourceVisible(kind: ResourceKind): Promise<boolean> {
    return this.resourceBar(kind).isVisible();
  }

  async getResourceValue(kind: ResourceKind): Promise<number> {
    const text = await this.resourceBar(kind).locator('.tabular-nums').textContent();
    return parseInt(text?.replace(/,/g, '') ?? '0', 10);
  }

  async getProductionRate(kind: ResourceKind): Promise<string> {
    const rate = this.resourceBar(kind).locator('.text-sky-400');
    if ((await rate.count()) === 0) return '';
    return (await rate.textContent()) ?? '';
  }

  async getDayText(): Promise<string> {
    return (await this.page.locator('header p.leading-none').textContent()) ?? '';
  }
}
