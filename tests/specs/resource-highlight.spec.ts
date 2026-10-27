import { test, expect } from '@playwright/test';
import { injectState } from '../helpers/army';
import { BuildingGridPage } from '../pages/BuildingGridPage';
import { MarketPage } from '../pages/MarketPage';
import { ResourceHUDPage } from '../pages/ResourceHUDPage';

const IDS = ['castle', 'farm', 'sawmill', 'mine', 'market', 'barracks', 'prefeitura'];

test.use({ reducedMotion: 'no-preference' });

test.describe('Destaque de recurso', () => {
  let hud: ResourceHUDPage;

  test.beforeEach(async ({ page }) => {
    hud = new ResourceHUDPage(page);
    const buildings = Object.fromEntries(
      IDS.map((id) => [id, { id, level: id === 'castle' || id === 'market' ? 1 : 0 }])
    );
    await injectState(page, { buildings });
    await expect(hud.meter('wood')).toBeVisible();
    await hud.startRecordingHighlights();
  });

  test('a produção contínua não destaca nenhum recurso', async ({ page }) => {
    await page.waitForTimeout(2500);
    expect(await hud.highlightedResources()).toEqual([]);
  });

  test('comprar madeira no mercado destaca madeira e ouro', async ({ page }) => {
    const grid = new BuildingGridPage(page);
    const market = new MarketPage(page);
    await grid.clickCard('Mercado');
    await market.buy('wood');
    await expect
      .poll(() => hud.highlightedResources())
      .toEqual(expect.arrayContaining(['Madeira', 'Ouro']));
    expect(await hud.highlightedResources()).not.toContain('Pedra');
  });
});
