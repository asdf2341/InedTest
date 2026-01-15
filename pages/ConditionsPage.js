
import {
  selectRandomOptionFromOpenedList,
  selectRandomGroupList
} from '../helpers/helpers.js';

export class ConditionsPage {
  constructor(page) {
    this.page = page;
  }

  async fillConditions(filePath) {
    const conditionsBlock = this.page
      .locator('p', { hasText: 'Условия объекта' })
      .locator('xpath=ancestor::div[contains(@class,"conditions-step")]');

    const switches = conditionsBlock.locator('span.MuiSwitch-switchBase');
    const fileInput = conditionsBlock.locator('input[type="file"][accept="application/pdf"]'); 

    await switches.nth(0).click();
    await fileInput.setInputFiles(filePath);

    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    await conditionsBlock
      .locator('input[type="date"]')
      .fill(todayString);

    await conditionsBlock.locator('//div[@role="combobox"]').click();
    await selectRandomOptionFromOpenedList(this.page);
    await selectRandomGroupList(conditionsBlock);

    await switches.nth(2).click();
    await this.page.getByRole('button', { name: 'Далее' }).click();
    await this.page.waitForTimeout(2000);
  }
}
