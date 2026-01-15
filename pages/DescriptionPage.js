// pages/DescriptionPage.js
export class DescriptionPage {
  constructor(page) {
    this.page = page;
  }

  async fillDescription(title, params) {
    const descriptionBlock = this.page.locator('div.description-step');



    await descriptionBlock
      .locator('input[placeholder*="Например: горячее предложение"]')
      .fill(title);

    await descriptionBlock
      .locator('input[placeholder*="Например: параметры и характеристики объекта"]')
      .fill(params);

    await this.page.getByRole('button', { name: 'Сохранить' }).click();
  }
}
