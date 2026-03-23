import { Page, Locator } from '@playwright/test';

export class BuildingModalPage {
  readonly dialog: Locator;

  constructor(private readonly page: Page) {
    this.dialog = page.getByRole('dialog');
  }

  isVisible(): Promise<boolean> {
    return this.dialog.isVisible();
  }

  async getName(): Promise<string> {
    return (await this.dialog.getByRole('heading', { level: 2 }).textContent()) ?? '';
  }

  async getLevel(): Promise<string> {
    return (await this.dialog.locator('p', { hasText: /^Nível/ }).textContent()) ?? '';
  }

  upgradeButton(): Locator {
    return this.dialog.getByRole('button', { name: /Upar para Nível/ });
  }

  async isUpgradeEnabled(): Promise<boolean> {
    return this.upgradeButton().isEnabled();
  }

  async isUpgradeDisabled(): Promise<boolean> {
    return this.upgradeButton().isDisabled();
  }

  async clickUpgrade(): Promise<void> {
    await this.upgradeButton().click();
  }

  async close(): Promise<void> {
    await this.dialog.getByRole('button', { name: 'Fechar' }).click();
  }

  async closeByOverlay(): Promise<void> {
    await this.page.locator('[data-slot="dialog-overlay"]').click({ position: { x: 50, y: 50 } });
  }
}
