import { test, expect } from '@playwright/test';
import { GameSpeedControlsPage } from '../pages/GameSpeedControlsPage';

test.describe('GameSpeedControls', () => {
  let controls: GameSpeedControlsPage;

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    controls = new GameSpeedControlsPage(page);
  });

  test('velocidade inicial é 1x', async () => {
    expect(await controls.isSpeedActive('1x')).toBe(true);
  });

  test('clicar em pausa ativa estado pausado', async () => {
    await controls.clickPause();
    expect(await controls.isPaused()).toBe(true);
  });

  test('clicar em pausa duas vezes retoma 1x', async () => {
    await controls.clickPause();
    await controls.clickPause();
    expect(await controls.isSpeedActive('1x')).toBe(true);
    expect(await controls.isPaused()).toBe(false);
  });

  test('clicar em 2x ativa 2x e desativa 1x', async () => {
    await controls.clickSpeed('2x');
    expect(await controls.isSpeedActive('2x')).toBe(true);
    expect(await controls.isSpeedActive('1x')).toBe(false);
  });

  test('clicar em 4x ativa 4x', async () => {
    await controls.clickSpeed('4x');
    expect(await controls.isSpeedActive('4x')).toBe(true);
  });

  test('clicar em 0.5x ativa 0.5x', async () => {
    await controls.clickSpeed('0.5x');
    expect(await controls.isSpeedActive('0.5x')).toBe(true);
  });

  test('apenas uma velocidade fica ativa por vez', async () => {
    await controls.clickSpeed('2x');
    const speeds: SpeedOption[] = ['0.5x', '1x', '2x', '4x'];
    const activeStates = await Promise.all(speeds.map((s) => controls.isSpeedActive(s)));
    expect(activeStates.filter(Boolean).length).toBe(1);
  });
});

type SpeedOption = '0.5x' | '1x' | '2x' | '4x';
