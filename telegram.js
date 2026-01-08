import TelegramBot from 'node-telegram-bot-api';
import { exec } from 'child_process';
import { sendMessage, sendPhoto } from './telegramUtils.js'; // если telegram.js в корне

const token = process.env.TELEGRAM_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/run_test/, async () => {
  await sendMessage('🚀 Запускаю автотест...');

  exec('npx playwright test InedTest/Locators.spec.js --timeout=120000', (error, stdout, stderr) => {
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
