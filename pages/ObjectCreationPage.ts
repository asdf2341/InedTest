// pages/ObjectPage.js

import {
  selectRandomHouse
} from '../utils/addInformation';
import {
  inputsText,fillInputNumber,selectCheckbox
} from '../utils/form';
import { expect } from '@playwright/test';

import { Page } from '@playwright/test';
export class ObjectPage {

  constructor(
    private readonly page: Page
  ) {}


  async fillAddress() {
// district name
    const district = this.page.getByRole('combobox').nth(1);
    await district.click();
    const selectedValue = this.page.getByRole('listbox').getByRole('option').first();
    await selectedValue.click();


  // street name
    const streetInput = this.page.locator('input[role="combobox"]').first();
    await streetInput.click();
    await streetInput.fill('Мангилик');
    const streetOption = this.page
      .getByRole('presentation')
      .getByRole('option')
      .first();

    const streetName = await streetOption.textContent();
    await streetOption.click();

  // house number
    const house = await selectRandomHouse(
      this.page,
      this.page.getByRole('combobox').nth(3)
    );

  // flat number
    const flat = Date.now().toString();

await this.page
  .locator('input[type="text"]')
  .last()
  .fill(flat);




    await this.page
      .getByRole('button', {
        name: 'Далее'
      })
      .click();


    return {
      streetName,
      house,
      flat
    };
  }

  async fillPersonalInfo() {
    const fioInput= this.page.locator('p',{hasText:'ФИО*'}).locator('xpath=following-sibling::div//input')
    await fioInput.fill('Ахметов Серик Маратович');
    
    const phoneInput= this.page.locator('p',{hasText:'Номер телефона*'}).locator('xpath=following-sibling::div//input');
    await phoneInput.fill('7 777 777 77 77')
    
    const contactStep= this.page.getByRole('combobox');
    await contactStep.click();
    const options = this.page.getByRole('option'); 

    await options.nth(1).click();
    await this.page.getByRole('button', { name: 'Далее' }).click();
  }

  async fillObjectDetails() {
    const objectPage = this.page.locator('div.px-4',{ has: this.page.getByText('Основные параметры') });
    await expect(objectPage).toBeVisible();
    function randomInt(min: number, max: number): string {
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}
    const rooms = randomInt(1, 4); 
    const price = randomInt(20000000, 25000000);
    const square = randomInt(50, 120); 
    const kitchenSquare = randomInt(15, 20); 
    const yearOfbuild = randomInt(2023, 2026); 
    const floor = randomInt(1, 5); 
    const buildingFloor = randomInt(6, 10); 

    
    await fillInputNumber(objectPage, [rooms, square, kitchenSquare,floor, buildingFloor]);
    await inputsText(objectPage,[price,yearOfbuild])
    await selectCheckbox(this.page,objectPage);
    
    const inputDeposit =
    objectPage.locator(
      'input[type="text"]:not([disabled])'
    );
    await inputDeposit.last().fill('30000000')
    await objectPage.locator(
    'div [role="combobox"]'
  ).last().click();
  await this.page.getByRole('option').nth(5).click()
    const nextButton = this.page.getByRole('button', { name: 'Далее' });

    await nextButton.click();
  }


}