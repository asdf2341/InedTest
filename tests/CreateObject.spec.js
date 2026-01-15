import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fillLogin } from '../helpers/helpers.js';
import { sendMessage, sendPhoto } from '../telegramUtils.js';
import { ObjectPage } from '../pages/ObjectCreationPage.js';
import { AdditionalParamsPage } from '../pages/AdditionalParamsPage.js';
import { ConditionsPage } from '../pages/ConditionsPage.js';
import { UploadPage } from '../pages/UploadPhotoPage.js';
import { DescriptionPage } from '../pages/DescriptionPage.js';

const successDir = path.resolve('successPhotos');
const errorDir = path.resolve('errorPhotos');
const videosDir = path.resolve('videos');

function cleanOldFiles(dir, days = 7) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  const now = Date.now();

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    const age = (now - stats.mtimeMs) / (1000 * 60 * 60 * 24); // в днях
    if (age > days) fs.unlinkSync(filePath);
  });
}
[errorDir, successDir, videosDir].forEach(dir => cleanOldFiles(dir, 7)); 

test('Create object end-to-end', async ({ browser }) => {
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });

  const page = await context.newPage();

  const objectPage = new ObjectPage(page);
  const additionalParamsPage = new AdditionalParamsPage(page);
  const conditionsPage = new ConditionsPage(page);
  const uploadPage = new UploadPage(page);
  const descriptionPage = new DescriptionPage(page);

  const createdObjectInfo = {};

  // --- скриншот только при ошибке, не сохраняем
  async function takeErrorScreenshot(stepName) {
    const buffer = await page.screenshot({ fullPage: true });
    await sendPhoto(chatId, buffer, `❌ Скриншот ошибки: ${stepName}`);
  }

  try {
    // --- Login ---
    await page.goto('http://85.202.192.46:8081/login');
    await fillLogin(page, 'ashamat@ined.kz', '12345678Test');
    await sendMessage(chatId, '🔐 Логин выполнен');

    // --- Select object type ---
    await page.getByText('Объекты').click();
    await page.getByText('Новый объект').click();
    createdObjectInfo.selectedValue = await objectPage.selectType();
    await sendMessage(chatId, `✅ Тип объекта выбран: ${createdObjectInfo.selectedValue}`);


    // --- Address ---
    const address = await objectPage.fillAddress();
    Object.assign(createdObjectInfo, address);
    await sendMessage(chatId, `✅ Адрес заполнен: ${address.streetName} ${address.RandomHouse}, кв ${address.randomFlat}`);


    // --- Personal info ---
    await objectPage.fillPersonalInfo();
    await sendMessage(chatId, '✅ Контакты заполнены');

    // --- Object details ---
    await objectPage.fillObjectDetails();
    await sendMessage(chatId, '✅ Основные параметры объекта заполнены');

    // --- Additional params ---
    await additionalParamsPage.fillAdditionalParams();
    await sendMessage(chatId, '✅ Дополнительные параметры заполнены');

    // --- Conditions ---
    await conditionsPage.fillConditions('InedInfo/Dogovor.pdf');
    await sendMessage(chatId, '✅ Условия объекта заполнены');



    // --- Upload photos ---
    await uploadPage.uploadPhotos('InedInfo');
    await sendMessage(chatId, '✅ Фото загружены');


    // --- Description ---
    await descriptionPage.fillDescription(
      'Это автотест сделал',
      'Автотест проверяю функционал'
    );
    await sendMessage(chatId, '✅ Описание объекта заполнено');

    // --- SUCCESS ---
    await sendMessage(
      chatId,
      `🎉 <b>Тест успешно завершен!</b>\n🏠 Адрес: ${createdObjectInfo.selectedValue}, ${createdObjectInfo.streetName} ${createdObjectInfo.RandomHouse}, кв ${createdObjectInfo.randomFlat}`
    );

  } catch (err) {
    await takeErrorScreenshot(err.step || 'неизвестный шаг');
    await sendMessage(chatId, `❌ <b>Тест упал!</b>\nОшибка: ${err.message}`);
    throw err;

  } finally {
    await context.close();
  }
});
