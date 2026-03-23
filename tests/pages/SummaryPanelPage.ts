import { Page, Locator } from '@playwright/test';

export class SummaryPanelPage {
  readonly panel: Locator;
  readonly queueSection: Locator;

  constructor(private readonly page: Page) {
    this.panel = page.locator('aside').filter({ has: page.getByRole('heading', { name: 'Fila de Construção' }) });
    this.queueSection = this.panel.locator('section').filter({ has: page.getByRole('heading', { name: 'Fila de Construção' }) });
  }

  async resetState(): Promise<void> {
    await this.page.evaluate(() => localStorage.clear());
    await this.page.reload();
  }

  isQueueEmpty(): Promise<boolean> {
    return this.panel.getByText('Nenhuma construção em andamento').isVisible();
  }

  queueItemCount(): Promise<number> {
    return this.queueSection.getByRole('listitem').count();
  }

  async getQueueItemName(index: number): Promise<string> {
    return (await this.queueSection.getByRole('listitem').nth(index).locator('p').first().textContent()) ?? '';
  }

  async getTotalBuildings(): Promise<string> {
    return (await this.panel.locator('dt', { hasText: 'Total de Construções' }).locator('+ dd').textContent()) ?? '';
  }

  async getTotalLevels(): Promise<string> {
    return (await this.panel.locator('dt', { hasText: 'Níveis Totais' }).locator('+ dd').textContent()) ?? '';
  }

  async getEmpireScore(): Promise<string> {
    return (await this.panel.locator('dt', { hasText: 'Pontuação do Império' }).locator('+ dd').textContent()) ?? '';
  }
}
