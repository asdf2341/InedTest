// pages/AdditionalParamsPage.js
import { fillObjectAddInfo, selectRandomGroupList } from '../helpers/helpers.js';

export class AdditionalParamsPage {
  constructor(page) {
    this.page = page;
  }

   async fillAdditionalParams() {
      const additionalParamsBlock = this.page.locator('p', { hasText: 'Дополнительные параметры' })
        .locator('xpath=following-sibling::div[contains(@class,"MuiBox-root")]');
  
      const additionalValues = {
        ceilingHeight: '3',
        complexName: 'Sana City',
        floors: '3',
        location: 'Astana City',
        krishaLink: 'https://krisha.kz/a/show/699607420',
        instagram: 'https://www.instagram.com/'
      };
  
      const inputs = additionalParamsBlock.locator(
        'input.MuiInputBase-input.MuiOutlinedInput-input'
      );
  
      let index = 0;
      for (const value of Object.values(additionalValues)) {
        await inputs.nth(index++).fill(value);
      }
  
      await fillObjectAddInfo(this.page);
      await this.page.waitForTimeout(1000);
      await selectRandomGroupList(additionalParamsBlock);
      await this.page.waitForTimeout(2000);
  
      const buttonsToClick = [
        'На улицу', 'Шкаф', 'Охрана', 'Интернет', 'Школа', 'Пандус'
      ];
      for (let i = 0; i < buttonsToClick.length; i++) {
        await additionalParamsBlock.nth(i + 1).getByRole('button', { name: buttonsToClick[i] }).click();
      }
  
      await this.page.getByRole('button', { name: 'Далее' }).click();
    }
}
