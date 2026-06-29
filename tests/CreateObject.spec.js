import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { login } from '../utils/auth';
import { sendMessage, sendPhoto } from '../telegramUtils.js';
import { ObjectPage } from '../pages/ObjectCreationPage';
import { AdditionalParamsPage } from '../pages/AdditionalParamsPage';
import { ConditionsPage } from '../pages/ConditionsPage';
import { UploadPage } from '../pages/UploadPhotoPage';
import { DescriptionPage } from '../pages/DescriptionPage';


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
// const changeStatusPage = new ChangeStatusPage(page);
  const createdObjectInfo = {};

const startTime = Date.now();

let report = `🚀 Test started\n\n`;

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes} мин ${seconds} сек`;
}

await page.goto('http://85.202.192.46:8081/login');
await login(page, 'ashamat@ined.kz', '12345678Test');

report += '🔐 Login\n';

try {

  await page.getByText('Объекты').click();
  await page.getByText('Новый объект').click();

  // Address
  const addr = await objectPage.fillAddress();
  Object.assign(createdObjectInfo, addr);
  report += '✅ Address\n';

  // Personal info
  await objectPage.fillPersonalInfo();
  report += '✅ Personal info\n';

  // Object details
  await objectPage.fillObjectDetails();
  report += '✅ Object details\n';

  // Additional params
  await additionalParamsPage.fillAdditionalParams();
  report += '✅ Additional params\n';

  // Conditions
  await conditionsPage.fillConditions('InedInfo/Dogovor.pdf');
  report += '✅ Conditions\n';

  // Upload
  await uploadPage.uploadPhotos('InedInfo');
  report += '✅ Upload photos\n';

  // Description
  await descriptionPage.fillDescription(
    'Это автотест сделал',
    'Автотест проверяю функционал'
  );
  report += '✅ Description\n';

  const descriptionBlock = page.locator('div.description-step');

  await descriptionBlock
    .getByRole('button', { name: 'Сохранить' })
    .waitFor({ state: 'detached' });
  await page.waitForTimeout(1000);
await page.waitForURL(url => {
  const pathname = url.pathname;

  return /^\/objects\/\d+$/.test(pathname);
});
const objectUrl = page.url();
const objectId = objectUrl.split('/').pop();

report += `

🆔 Object ID: ${objectId}
🔗 ${objectUrl}
`;

  const screenshotPath = path.join(
    successDir,
    `success-${Date.now()}.png`
  );

  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
  });

  report += `

🎉 SUCCESS

🏠 ${createdObjectInfo.selectedValue ?? ''}

⏰ ${new Date().toLocaleTimeString('ru-RU')}

⏱️ ${formatDuration(Date.now() - startTime)}
`;

  await sendPhoto(chatId, screenshotPath);
  await sendMessage(chatId, report);

} catch (err) {

  const screenshotPath = path.join(
    errorDir,
    `error-${Date.now()}.png`
  );

  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
  });

  report += `

❌ FAILED

⏰ ${new Date().toLocaleTimeString('ru-RU')}

⏱️ ${formatDuration(Date.now() - startTime)}

Ошибка:

${String(err.message)}
`;

  await sendPhoto(chatId, screenshotPath);
  await sendMessage(chatId, report);

  throw err;

} finally {

  await page.close();
  await context.close();

}})