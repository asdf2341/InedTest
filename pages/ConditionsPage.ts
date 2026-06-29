import { Page } from '@playwright/test';
import {
  selectCheckbox,
  selectRandomGroupList,
} from '../utils/form';

export class ConditionsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async fillConditions(filePath: string): Promise<void> {
    const conditionsBlock = this.page.locator('div.px-4', {
      has: this.page.getByText('Условия объекта'),
    });

    const switches = conditionsBlock.locator('span.MuiSwitch-switchBase');
    const fileInput = conditionsBlock.locator('input[type="file"]');

    await switches.nth(0).click();

    const dateField = conditionsBlock
      .locator('[role="spinbutton"]')
      .first();

    await dateField.click();

    const today = new Date();

    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = String(today.getFullYear());

    await dateField.pressSequentially(day);

    await conditionsBlock
      .locator('[role="spinbutton"]')
      .nth(1)
      .pressSequentially(month);

    await conditionsBlock
      .locator('[role="spinbutton"]')
      .nth(2)
      .pressSequentially(year);

    await fileInput.setInputFiles(filePath);

    console.log('Filled date');

    await switches.nth(1).click();
    await fileInput.nth(1).setInputFiles(filePath);

    const reasonToSell = conditionsBlock.getByRole('combobox');
    await reasonToSell.click();

    const options = this.page.getByRole('option');
    await options.nth(2).click();

    const keyInOffice = this.page.getByRole('checkbox').last();
    await keyInOffice.check();

    await selectRandomGroupList(conditionsBlock);

    await this.page.getByRole('button', { name: 'Далее' }).click();
  }
}