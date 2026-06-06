import { test, expect } from '@playwright/test';
import { ArmyPage } from '../pages/ArmyPage';
import { injectState } from '../helpers/army';

const IDS = ['castle', 'farm', 'sawmill', 'mine', 'market', 'barracks', 'prefeitura'];

test.describe('ArmyPage — defeat path', () => {
  test('lose: mobilized units removed after defeat', async ({ page }) => {
    const buildings = Object.fromEntries(
      IDS.map((id) => [id, { id, level: id === 'castle' ? 1 : id === 'barracks' ? 3 : 0 }])
    );
    const army = new ArmyPage(page);
    await injectState(page, {
      militaryUnits: { warrior: 1, archer: 0, lancer: 0 },
      buildings,
      defeatedEnemies: ['bandits', 'raiders', 'warband', 'militia'],
    });
    await army.seedRng(0.0);
    await army.navigate();
    await army.enemyAttackButton('army').click();
    await army.mobilizationIncrement('warrior').click();
    await army.mobilizationConfirm().click();
    await expect(army.battleOutcome()).toHaveText(/derrota/i, { timeout: 5000 });
    await army.battleDismiss().click();
    await expect(army.unitCount('warrior')).toHaveText('0');
  });
});
