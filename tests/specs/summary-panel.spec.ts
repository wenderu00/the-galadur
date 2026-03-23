import { test, expect } from '@playwright/test';
import { SummaryPanelPage } from '../pages/SummaryPanelPage';

test.describe('SummaryPanel', () => {
  let panel: SummaryPanelPage;

  test.beforeEach(async ({ page }) => {
    panel = new SummaryPanelPage(page);
    await page.goto('/');
    await panel.resetState();
  });

  test('fila de construção exibe mensagem de fila vazia no estado inicial', async () => {
    expect(await panel.isQueueEmpty()).toBe(true);
  });

  test('Total de Construções é 1 no estado inicial', async () => {
    expect(await panel.getTotalBuildings()).toBe('1');
  });

  test('Níveis Totais é 1 no estado inicial', async () => {
    expect(await panel.getTotalLevels()).toBe('1');
  });

  test('Pontuação do Império é 30 no estado inicial', async () => {
    expect(await panel.getEmpireScore()).toBe('30');
  });
});
