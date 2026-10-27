import { Page, Locator } from '@playwright/test';

export class SummaryPanelPage {
  readonly panel: Locator;
  readonly queueSection: Locator;

  constructor(private readonly page: Page) {
    this.panel = page.getByTestId('summary-panel');
    this.queueSection = this.panel.getByRole('region', { name: 'Fila de construção' });
  }

  async resetState(): Promise<void> {
    await this.page.evaluate(() => localStorage.clear());
    await this.page.reload();
  }

  emptyQueueMessage(): Locator {
    return this.queueSection.getByText('Nenhuma construção em andamento');
  }

  queueItemCount(): Promise<number> {
    return this.queueSection.getByRole('listitem').count();
  }

  async getQueueItemName(index: number): Promise<string> {
    return (await this.queueSection.getByRole('listitem').nth(index).textContent()) ?? '';
  }

  private statValue(term: string): Locator {
    return this.panel.locator('dt', { hasText: term }).locator('+ dd');
  }

  async getTotalBuildings(): Promise<string> {
    return (await this.statValue('Total de construções').textContent()) ?? '';
  }

  async getTotalLevels(): Promise<string> {
    return (await this.statValue('Níveis totais').textContent()) ?? '';
  }

  async getEmpireScore(): Promise<string> {
    return (await this.statValue('Pontuação do império').textContent()) ?? '';
  }
}
