import { test, expect } from '@playwright/test';
import { ArmyPage } from '../pages/ArmyPage';
import { injectState } from '../helpers/army';

test.describe('ArmyPage', () => {
  let army: ArmyPage;

  test.beforeEach(async ({ page }) => {
    army = new ArmyPage(page);
    await injectState(page);
  });

  test('clicking Exército nav item shows army page', async ({ page }) => {
    await army.navigate();
    await expect(page.getByTestId('army-page')).toBeVisible();
  });

  test('unit roster displays counts from state', async ({ page }) => {
    await injectState(page, { militaryUnits: { warrior: 7, archer: 3, lancer: 0 } });
    await army.navigate();
    await expect(army.unitCount('warrior')).toHaveText('7');
    await expect(army.unitCount('archer')).toHaveText('3');
  });

  test('first enemy (bandits) is visible and unlocked', async () => {
    await army.navigate();
    await expect(army.enemyCard('bandits')).toBeVisible();
    await expect(army.enemyAttackButton('bandits')).not.toBeDisabled();
  });

  test('second enemy requires defeating bandits first', async () => {
    await army.navigate();
    await expect(army.enemyCard('raiders')).toBeVisible();
    await expect(army.enemyAttackButton('raiders')).toBeDisabled();
  });

  test('second enemy unlocked after defeating bandits', async ({ page }) => {
    await injectState(page, { defeatedEnemies: ['bandits'] });
    await army.navigate();
    await expect(army.enemyAttackButton('raiders')).not.toBeDisabled();
  });

  test('attack button opens mobilization modal', async () => {
    await army.navigate();
    await army.enemyAttackButton('bandits').click();
    await expect(army.mobilizationConfirm()).toBeVisible();
  });

  test('mobilization confirm disabled when no units selected', async () => {
    await army.navigate();
    await army.enemyAttackButton('bandits').click();
    await expect(army.mobilizationConfirm()).toBeDisabled();
  });

  test('win: resources increase and units remain after victory', async ({ page }) => {
    await injectState(page, { militaryUnits: { warrior: 50, archer: 0, lancer: 0 } });
    await army.seedRng(1.0);
    await army.navigate();
    await army.enemyAttackButton('bandits').click();
    for (let i = 0; i < 10; i++) {
      await army.mobilizationIncrement('warrior').click();
    }
    await army.mobilizationConfirm().click();
    await expect(army.battleOutcome()).toHaveText(/vitória/i, { timeout: 5000 });
    await army.battleDismiss().click();
    await expect(army.unitCount('warrior')).toHaveText('50');
  });
});
