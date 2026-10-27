import { Page, Locator } from '@playwright/test';

type TradeResource = 'wood' | 'stone' | 'food';

export class MarketPage {
  readonly panel: Locator;

  constructor(page: Page) {
    this.panel = page.getByRole('dialog').getByTestId('market-panel');
  }

  buyButton(resource: TradeResource): Locator {
    return this.panel.getByTestId(`market-buy-${resource}`);
  }

  async buy(resource: TradeResource): Promise<void> {
    await this.buyButton(resource).click();
  }
}
