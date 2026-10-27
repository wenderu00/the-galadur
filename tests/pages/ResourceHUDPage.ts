import { Page, Locator } from '@playwright/test';

export type ResourceKind = 'wood' | 'stone' | 'food' | 'gold';

const RESOURCE_LABELS: Record<ResourceKind, string> = {
  wood: 'Madeira',
  stone: 'Pedra',
  food: 'Comida',
  gold: 'Ouro',
};

export class ResourceHUDPage {
  readonly hud: Locator;

  constructor(private readonly page: Page) {
    this.hud = page.getByTestId('game-hud');
  }

  async resetState() {
    await this.page.evaluate(() => localStorage.clear());
    await this.page.reload();
  }

  meter(kind: ResourceKind): Locator {
    return this.hud.getByRole('meter', { name: RESOURCE_LABELS[kind] });
  }

  rate(kind: ResourceKind): Locator {
    return this.hud.getByTestId(`resource-bar-${kind}-rate`);
  }

  async getResourceValue(kind: ResourceKind): Promise<number> {
    const value = await this.meter(kind).getAttribute('aria-valuenow');
    return Math.floor(Number(value ?? '0'));
  }

  async startRecordingHighlights(): Promise<void> {
    await this.page.evaluate(() => {
      const record: string[] = [];
      (window as unknown as Record<string, unknown>)['__highlights'] = record;
      document.addEventListener('animationstart', (event) => {
        const meter = (event.target as Element).closest('[role="meter"]');
        const labelId = meter?.getAttribute('aria-labelledby');
        const label = labelId ? document.getElementById(labelId)?.textContent : null;
        if (label) record.push(label);
      });
    });
  }

  async highlightedResources(): Promise<string[]> {
    return this.page.evaluate(
      () => ((window as unknown as Record<string, unknown>)['__highlights'] as string[]) ?? []
    );
  }

  dayValue(): Locator {
    return this.hud.getByTestId('game-day-value');
  }
}
