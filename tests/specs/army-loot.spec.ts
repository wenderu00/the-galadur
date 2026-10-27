import { test, expect } from '@playwright/test';
import { ArmyPage } from '../pages/ArmyPage';
import { injectState } from '../helpers/army';

test.describe('ArmyPage: saque', () => {
  test('resultado da vitória mostra o saque com nomes de recurso em português', async ({
    page,
  }) => {
    const army = new ArmyPage(page);
    await injectState(page, { militaryUnits: { warrior: 50, archer: 0, lancer: 0 } });
    await army.seedRng(1.0);
    await army.navigate();
    await army.enemyAttackButton('bandits').click();
    for (let i = 0; i < 10; i++) {
      await army.mobilizationIncrement('warrior').click();
    }
    await army.mobilizationConfirm().click();
    await expect(army.battleOutcome()).toHaveText('Vitória', { timeout: 5000 });
    await expect(army.battleResult()).toContainText('+10 ouro');
    await expect(army.battleResult()).toContainText('+5 comida');
    await expect(army.battleResult()).not.toContainText('gold');
  });
});
