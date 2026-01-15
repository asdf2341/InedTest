import fs from 'fs';
import path from 'path';

export class UploadPage {
  constructor(page) {
    this.page = page;
  }

  async uploadPhotos(folderPath) {
    let files = fs.readdirSync(folderPath)
      .filter(file => file.endsWith('.jpg'));

    files.sort(() => Math.random() - 0.5);

    const coverInput = this.page.locator(
      'div.photo-section:has-text("Обложка") input[type="file"]'
    );
    await coverInput.setInputFiles(path.join(folderPath, files[0]));

    const objectInput = this.page.locator(
      'div.photo-section:has-text("Фотографии объекта") input[type="file"]'
    );
    await objectInput.setInputFiles(
      files.slice(1, 6).map(f => path.join(folderPath, f))
    );

    await this.page.getByRole('button', { name: 'Далее' }).click();
  }
}
