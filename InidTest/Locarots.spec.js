import { test, expect } from '@playwright/test';
import { fillInput, fillLogin, selectRandomHouse, fillObjectDetails, selectRandomOption, fillRandomFromArray, fillObjectAddInfo, selectRandomOptionFromOpenedList ,selectRandomGroupList } from './helpers.js';
import fs from 'fs';
import path from 'path';
import { sendMessage, sendPhoto } from './telegramUtils.js';

test('Adaptive Object Creation', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: 'videos/', size: { width: 1920, height: 1080 } }
  });

  const page = await context.newPage();

  try {
    // --- Login ---
    await page.goto('http://85.202.192.46:8081/login');
    await page.waitForTimeout(200);
    await fillLogin(page, 'ashamat@ined.kz', '12345678Test');

    // --- Navigate to Object Creation ---
    await page.getByText('Объекты').click();
    await page.getByText('Новый объект').click();

    // --- Select Type ---
    const selectedValue = await selectRandomOption(page, page.getByRole('combobox').nth(1));

    // --- Fill Address ---
    const streets = ['Орынбор', 'Кабанбай', 'Туран', 'Мангилик', 'Турар'];
    const streetName = await fillRandomFromArray(page, 'Пример: Кабанбай батыра', streets);
    const inputHouse = await page.getByPlaceholder('Пример: 5/5');
    const RandomHouse = await selectRandomHouse(page, inputHouse);
    const randomFlat = Math.floor(Math.random() * 100 + 1);
    await page.getByPlaceholder('Не заполнено').fill(String(randomFlat));

    await page.getByRole('button', { name: 'Далее' }).click();

    // --- Fill Personal Info ---
    await page.getByPlaceholder('ФИО').fill('Ахметов Серик Маратович');
    await page.getByPlaceholder('+7 (___) ___ __ __').fill('777 777 77 77');
   const contactStep= page.locator('div.contacts-step__form') 
   await contactStep.getByRole('combobox').click();
   const options = page.getByRole('option'); 
   const count = await options.count();
    const randomIndex = Math.floor(Math.random() * (count - 1)) + 1; 
   await options.nth(randomIndex).click()

    await page.getByRole('button', { name: 'Далее' }).click();

    // --- Fill Object Details ---
    function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; } 
    const rooms = randomInt(1, 4); 
    const price = randomInt(18000000, 85000000);
     const square = randomInt(35, 120); 
     const kitchenSquare = randomInt(3, 20); 
     const yearOfb = randomInt(1990, 2030); 
     const floor = randomInt(1, 20); 
     const buildingFloor = randomInt(5, 20); 
     await fillInput(page, [rooms, price, square, kitchenSquare, yearOfb, floor, buildingFloor]);

    await fillObjectDetails(page);
    await page.getByRole('button', { name: 'Далее' }).click();

    // --- Additional Parameters ---
    const additionalParamsBlock = page.locator('p', { hasText: 'Дополнительные параметры' })
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

    await fillObjectAddInfo(page);
await page.waitForTimeout(1000);
    await selectRandomGroupList(additionalParamsBlock)
    await page.waitForTimeout(2000);

    const buttonsToClick = [
      'На улицу', 'Шкаф', 'Охрана', 'Интернет', 'Школа', 'Пандус'
    ];
    for (let i = 0; i < buttonsToClick.length; i++) {
      await additionalParamsBlock.nth(i + 1).getByRole('button', { name: buttonsToClick[i] }).click();
    }
    await page.getByRole('button', { name: 'Далее' }).click();

    // --- Conditions ---
    const conditionsBlock = page.locator('p', { hasText: 'Условия объекта' })
      .locator('xpath=ancestor::div[contains(@class,"conditions-step")]');

 const switches = conditionsBlock.locator('span.MuiSwitch-switchBase');
const filePath = path.resolve('InedInfo/Dogovor.pdf');
const fileInput = page.locator('input[type="file"]').first();

for (const index of [0, 1]) {
  await switches.nth(index).click();
  await fileInput.setInputFiles(filePath);
}

    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    await conditionsBlock.locator('input[type="date"]').fill(todayString);

    
    await conditionsBlock.locator('//div[@role="combobox"]').click();
    await selectRandomOptionFromOpenedList(page)


  await selectRandomGroupList(conditionsBlock)
    await conditionsBlock.locator('span.MuiSwitch-switchBase').nth(2).click();
    await page.getByRole('button', { name: 'Далее' }).click();
    await page.waitForTimeout(2000);

    // --- Upload Photos ---
    const folderPath = path.resolve('InedInfo');
    let files = fs.readdirSync(folderPath).filter(file => file.endsWith('.jpg'));
    files.sort(() => Math.random() - 0.5); // shuffle

    const coverInput = page.locator('div.photo-section:has-text("Обложка") input[type="file"]');
    await coverInput.setInputFiles(path.join(folderPath, files[0]));

    const objectInput = page.locator('div.photo-section:has-text("Фотографии объекта") input[type="file"]');
    await objectInput.setInputFiles(files.slice(1, 10).map(f => path.join(folderPath, f)));

    await page.getByRole('button', { name: 'Далее' }).click();

    // --- Description ---
    const descriptionBlock = page.locator('div.description-step');
    await descriptionBlock.waitFor({ state: 'visible', timeout: 60000 });
    await descriptionBlock.locator('input[placeholder*="Например: горячее предложение"]').fill('Это автотест сделал');
    await descriptionBlock.locator('input[placeholder*="Например: параметры и характеристики объекта"]').fill('Автотест проверяю функционал добавления объекта');

    await page.getByRole('button', { name: 'Сохранить' }).click();
    await page.waitForTimeout(2000);

    // --- Success ---
    const successDir = path.resolve('successPhotos');
const errorDir = path.resolve('errorPhotos');
if (!fs.existsSync(successDir)) fs.mkdirSync(successDir);
if (!fs.existsSync(errorDir)) fs.mkdirSync(errorDir);
       const successScreenshot = path.join(successDir, `screenshot_success_${Date.now()}.png`);
    await page.screenshot({ path: successScreenshot, fullPage: true });
    await sendMessage(`✅ <b>Тест</b> успешно завершен!\n🏠 Адрес: ${selectedValue}, ${streetName} ${RandomHouse}, кв ${randomFlat}, 📞 Контакты, 📄 Основное, ➕ Дополнительно, 📷 Фото, 📝 Описание — все заполнено.`);
    await sendPhoto(successScreenshot);

  } catch (err) {
   const errorScreenshot = path.join(errorDir, `screenshot_error_${Date.now()}.png`);
    await page.screenshot({ path: errorScreenshot, fullPage: true });
    await sendMessage(`❌ <b>Тест </b> упал!\nОшибка: ${err.message}`);
    await sendPhoto(errorScreenshot);
    throw err;

  } finally {
    await context.close();
  }
});
