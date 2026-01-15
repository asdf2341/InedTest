// pages/ObjectPage.js
import { fillInput, fillObjectDetails, selectRandomHouse, fillRandomFromArray, selectRandomOption, fillObjectAddInfo, selectRandomOptionFromOpenedList, selectRandomGroupList } from '../helpers/helpers.js';
import fs from 'fs';
import path from 'path';

export class ObjectPage {
  constructor(page) {
    this.page = page;
  }

  async selectType() {
    const selectedValue = await selectRandomOption(this.page, this.page.getByRole('combobox').nth(1));
    return selectedValue;
  }

  async fillAddress() {
    const streets = ['Орынбор', 'Кабанбай', 'Туран', 'Мангилик', 'Турар'];
    const streetName = await fillRandomFromArray(this.page, 'Пример: Кабанбай батыра', streets);
    const inputHouse = await this.page.getByPlaceholder('Пример: 5/5');
    const RandomHouse = await selectRandomHouse(this.page, inputHouse);
    const randomFlat = Math.floor(Math.random() * 100 + 1);
    await this.page.getByPlaceholder('Не заполнено').fill(String(randomFlat)+'а');
    await this.page.getByRole('button', { name: 'Далее' }).click();

    return { streetName, RandomHouse, randomFlat };
  }

  async fillPersonalInfo() {
    await this.page.getByPlaceholder('ФИО').fill('Ахметов Серик Маратович');
    await this.page.getByPlaceholder('+7 (___) ___ __ __').fill('777 777 77 77');
    const contactStep= this.page.locator('div.contacts-step__form');
    await contactStep.getByRole('combobox').click();
    const options = this.page.getByRole('option'); 
    const count = await options.count();
    const randomIndex = Math.floor(Math.random() * (count - 1)) + 1; 
    await options.nth(randomIndex).click();
    await this.page.getByRole('button', { name: 'Далее' }).click();
  }

  async fillObjectDetails() {
    function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; } 
    const rooms = randomInt(1, 4); 
    const price = randomInt(18000000, 85000000);
    const square = randomInt(35, 120); 
    const kitchenSquare = randomInt(3, 20); 
    const yearOfb = randomInt(1990, 2030); 
    const floor = randomInt(1, 20); 
    const buildingFloor = randomInt(5, 20); 
    await fillInput(this.page, [rooms, price, square, kitchenSquare, yearOfb, floor, buildingFloor]);
    await fillObjectDetails(this.page);
    await this.page.getByRole('button', { name: 'Далее' }).click();
  }

 



}
