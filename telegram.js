import TelegramBot from 'node-telegram-bot-api';
import { exec } from 'child_process';
import { sendMessage, sendPhoto } from './telegramUtils.js'; // если telegram.js в корне
import express from 'express';
import path from 'path';

const token = process.env.TELEGRAM_TOKEN;
const webhookUrl = process.env.WEBHOOK_URL;

const bot = new TelegramBot(token, { polling: false });

const app = express();
app.use(express.json());

app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});
const playwrightBin = path.resolve('node_modules', '.bin', 'playwright');
bot.onText(/\/run_test/, async () => {
  await sendMessage('🚀 Запускаю автотест...');

  exec('${playwrightBin} test InedTest/Locators.spec.js --timeout=120000',  { maxBuffer: 1024 * 1024 * 5 }, (error, stdout, stderr) => {
    console.log('===== STDOUT =====');
    console.log(stdout);
    console.log('===== STDERR =====');
    console.log(stderr);
    if (error) {
      console.error('❌ Playwright test failed:', error);
      sendMessage(`❌ Ошибка при запуске теста:\n${error.message}`);
      return;
    }
    if (stderr) {
      console.warn('⚠️ Playwright warnings/errors:', stderr);
      sendMessage(`⚠️ Поток ошибок:\n${stderr}`);
      return;
    }
    sendMessage(`✅ Автотест завершился. Вывод:\n${stdout}`);
  });
}); 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));