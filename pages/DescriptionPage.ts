import { Page } from '@playwright/test';

export class DescriptionPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async fillDescription(title: string, description: string): Promise<void> {
    const descriptionBlock = this.page.locator('div.px-4');

    await descriptionBlock
      .locator('textarea')
      .first()
      .fill(title);

    await descriptionBlock
      .locator('textarea:not([aria-hidden="true"])')
      .last()
      .fill(description);

    await this.page.getByRole('button', { name: 'Сохранить' }).click();
  }
}