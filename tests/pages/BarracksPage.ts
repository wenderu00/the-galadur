import { Page, Locator } from '@playwright/test';

export class BarracksPage {
  readonly dialog: Locator;
  readonly panel: Locator;

  constructor(private readonly page: Page) {
    this.dialog = page.getByRole('dialog');
    this.panel = this.dialog.locator('section', { hasText: 'Unidades Disponíveis' });
  }

  unitList(): Locator {
    return this.panel.getByRole('list');
  }

  unitCard(name: string): Locator {
    return this.panel.locator('[data-testid^="unit-card-"]').filter({ hasText: name });
  }

  trainButton(unitName: string): Locator {
    return this.unitCard(unitName).locator('[data-testid^="unit-train-"]');
  }

  unitCount(unitName: string): Locator {
    return this.unitCard(unitName).locator('[data-testid^="unit-count-"]');
  }

  trainingSection(): Locator {
    return this.dialog.locator('section', { hasText: 'Treinando' }).last();
  }

  notBuiltMessage(): Locator {
    return this.dialog.locator('p', { hasText: 'Construa o Quartel' });
  }

  async clickTrain(unitName: string): Promise<void> {
    await this.trainButton(unitName).click();
  }
}
