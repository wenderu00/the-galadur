import { Page, Locator } from '@playwright/test';

type ThemeLabel = 'sistema' | 'escuro' | 'claro';

export class ThemePage {
  constructor(private readonly page: Page) {}

  async choose(label: ThemeLabel): Promise<void> {
    await this.page
      .getByRole('radiogroup', { name: 'Tema' })
      .getByRole('radio', { name: label })
      .click();
  }

  root(): Locator {
    return this.page.locator('html');
  }
}
