import { Page } from '@playwright/test';

type SpeedOption = '0.5x' | '1x' | '2x' | '4x';

export class GameSpeedControlsPage {
  constructor(private readonly page: Page) {}

  async resetState() {
    await this.page.reload();
  }

  private pauseButton() {
    return this.page
      .getByRole('button', { name: '1x', exact: true })
      .locator('..')
      .getByRole('button')
      .first();
  }

  private speedButton(speed: SpeedOption) {
    return this.page.getByRole('button', { name: speed, exact: true });
  }

  async clickPause() {
    await this.pauseButton().click();
  }

  async clickSpeed(speed: SpeedOption) {
    await this.speedButton(speed).click();
  }

  async isSpeedActive(speed: SpeedOption): Promise<boolean> {
    const classes = await this.speedButton(speed).getAttribute('class');
    return classes?.includes('bg-blue-600') ?? false;
  }

  async isPaused(): Promise<boolean> {
    const classes = await this.pauseButton().getAttribute('class');
    return classes?.includes('bg-blue-600') ?? false;
  }
}
