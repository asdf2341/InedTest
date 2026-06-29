import { expect, Page } from '@playwright/test';
import {
  inputsText,
  fillInputNumber,
  selectCheckbox,
  selectRandomGroupList,
} from '../utils/form';

export class AdditionalParamsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async fillAdditionalParams(): Promise<void> {
    const additionalParamsBlock = this.page.locator('div.px-4', {
      has: this.page.getByText('Дополнительные параметры'),
    });

    await expect(additionalParamsBlock).toBeVisible();

    const additionalValues = {
      ceilingHeight: '3',
      complexName: 'Sana City',
      floors: '3',
      locations: 'Astana City',
      krishaLink: 'https://krisha.kz/a/show/699607420',
      instagram: 'https://www.instagram.com/',
      tiktok: 'https://www.instagram.com/',
    };

    await fillInputNumber(additionalParamsBlock, [
      additionalValues.ceilingHeight,
      additionalValues.floors,
    ]);
   

    await inputsText(additionalParamsBlock, [
      additionalValues.complexName,
      additionalValues.locations,
      additionalValues.krishaLink,
      additionalValues.instagram,
      additionalValues.tiktok,
    ]);
    

    await selectCheckbox(this.page, additionalParamsBlock);
    

    await selectRandomGroupList(additionalParamsBlock);
   

    const buttonsToClick = [
      'На улицу',
      'Шкаф',
      'Охрана',
      'Интернет',
      'Школа',
      'Пандус',
    ];

    for (const text of buttonsToClick) {
      const button = additionalParamsBlock
        .locator('[role="button"]')
        .filter({ hasText: text });

      await button.click();
      
    }

    await this.page.getByRole('button', { name: 'Далее' }).click();
  }
}