import { Page, Locator } from '@playwright/test';

export class BarracksPage {
  readonly dialog: Locator;
  readonly panel: Locator;

  constructor(private readonly page: Page) {
    this.dialog = page.getByRole('dialog');
    this.panel = this.dialog.getByRole('region', { name: 'Unidades disponíveis' });
  }

  unitList(): Locator {
    return this.panel.getByRole('list');
  }

  unitCard(name: string): Locator {
    return this.panel.getByTestId(/^unit-card-/).filter({ hasText: name });
  }

  trainButton(unitName: string): Locator {
    return this.unitCard(unitName).getByTestId(/^unit-train-/);
  }

  unitCount(unitName: string): Locator {
    return this.unitCard(unitName).getByTestId(/^unit-count-/);
  }

  trainingSection(): Locator {
    return this.dialog.getByRole('region', { name: 'Treinando' });
  }

  unitTrainingTime(unitName: string): Locator {
    return this.unitCard(unitName).getByTestId(/^unit-training-time-/);
  }

  notBuiltMessage(): Locator {
    return this.dialog.getByText('Construa o Quartel para treinar unidades militares.');
  }

  async clickTrain(unitName: string): Promise<void> {
    await this.trainButton(unitName).click();
  }
}
