import { Page } from '@playwright/test';

type SpeedOption = '0.5x' | '1x' | '2x' | '4x';

export class GameSpeedControlsPage {
  constructor(private readonly page: Page) {}

  async resetState() {
    await this.page.reload();
  }

  async clickPause() {
    await this.page.getByTestId('speed-btn-pause').click();
  }

  async clickSpeed(speed: SpeedOption) {
    await this.page.getByTestId(`speed-btn-${speed}`).click();
  }

  async isSpeedActive(speed: SpeedOption): Promise<boolean> {
    const value = await this.page.getByTestId(`speed-btn-${speed}`).getAttribute('data-active');
    return value === 'true';
  }

  async isPaused(): Promise<boolean> {
    const value = await this.page.getByTestId('speed-btn-pause').getAttribute('data-active');
    return value === 'true';
  }
}
