import fs from 'fs';
import path from 'path';
import { Page } from '@playwright/test';

export class UploadPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async uploadPhotos(folderPath: string): Promise<void> {
    let files = fs
      .readdirSync(folderPath)
      .filter((file) => file.endsWith('.jpg'));

    files.sort(() => Math.random() - 0.5);

    const coverSection = this.page.locator('div', {
      has: this.page.getByText('Обложка'),
    });

    const coverInput = coverSection
      .locator('input[type="file"]')
      .first();

    await coverInput.setInputFiles(path.join(folderPath, files[0]));

    const photoSection = this.page.locator('div', {
      has: this.page.getByText('Фотографии объекта'),
    });

    const photoInput = photoSection
      .locator('input[type="file"]')
      .last();

    await photoInput.setInputFiles(
      files.slice(1, 9).map((file) => path.join(folderPath, file))
    );

    await this.page.getByRole('button', { name: 'Далее' }).click();
  }
}