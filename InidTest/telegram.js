import TelegramBot from 'node-telegram-bot-api';
import { exec } from 'child_process';
// import path from 'path';

const token = process.env.TELEGRAM_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

const bot = new TelegramBot(token, { polling: true });

// Утилиты
export const sendMessage = async (message) => {
  try {
    await bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
  } catch (err) {
    console.error(err);
  }
};

export const sendPhoto = async (filePath, caption = '') => {
  try {
    await bot.sendPhoto(chatId, filePath, { caption, parse_mode: 'HTML',   contentType: 'image/jpeg'});
  } catch (err) {
    console.error(err);
  }
};

// Команда /run_test
bot.onText(/\/run_test/, async () => {
  await sendMessage('🚀 Запускаю автотест...');

  exec('npx playwright test Locarots.spec.js --timeout=120000', (error, stdout, stderr) => {
    if (error) {
       console.error('❌ Playwright test failed:');
    console.error('Error object:', error);
    console.error('stdout:', stdout);
    console.error('stderr:', stderr);
      sendMessage(`❌ Ошибка при запуске теста:\n${error.message}`);
      return;
    }
    if (stderr) {
       console.warn('⚠️ Playwright warnings/errors:');
    console.warn(stderr);
      sendMessage(`⚠️ Поток ошибок:\n${stderr}`);
      return;
    }
    sendMessage(`✅ Автотест завершился. Вывод:\n${stdout}`);
  });
});
