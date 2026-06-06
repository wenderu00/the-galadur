import { Page, Locator } from '@playwright/test';

export class ArmyPage {
  readonly navItem: Locator;

  constructor(private readonly page: Page) {
    this.navItem = page.getByTestId('desktop-sidebar').locator('[data-testid="nav-item-exercito"]');
  }

  async navigate(): Promise<void> {
    await this.navItem.click();
  }

  unitCount(unitId: string): Locator {
    return this.page.getByTestId(`army-unit-${unitId}-count`);
  }

  enemyCard(enemyId: string): Locator {
    return this.page.getByTestId(`enemy-card-${enemyId}`);
  }

  enemyAttackButton(enemyId: string): Locator {
    return this.page.getByTestId(`enemy-card-${enemyId}-attack`);
  }

  mobilizationCount(unitId: string): Locator {
    return this.page.getByTestId(`mobilization-unit-${unitId}-count`);
  }

  mobilizationIncrement(unitId: string): Locator {
    return this.page.getByTestId(`mobilization-unit-${unitId}-increment`);
  }

  mobilizationConfirm(): Locator {
    return this.page.getByTestId('mobilization-confirm');
  }

  battleResult(): Locator {
    return this.page.getByTestId('battle-result');
  }

  battleOutcome(): Locator {
    return this.page.getByTestId('battle-result-outcome');
  }

  battleDismiss(): Locator {
    return this.page.getByTestId('battle-result-dismiss');
  }

  async seedRng(value: number): Promise<void> {
    await this.page.evaluate((v) => {
      (window as unknown as Record<string, unknown>)['__combatRngOverride'] = () => v;
    }, value);
  }

  async clearRng(): Promise<void> {
    await this.page.evaluate(() => {
      (window as unknown as Record<string, unknown>)['__combatRngOverride'] = undefined;
    });
  }
}
