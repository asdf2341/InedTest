import TelegramBot from 'node-telegram-bot-api';
import { exec } from 'child_process';
import { sendMessage, sendPhoto } from './telegramUtils.js';
import 'dotenv/config';
import express from 'express';

const token = process.env.TELEGRAM_TOKEN;
const webhookUrl = process.env.WEBHOOK_URL; 

const bot = new TelegramBot(token, { polling: false });

const app = express();
app.use(express.json());

app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

bot.onText(/\/run_test/, async (msg) => { 
  await sendMessage('🚀 Запускаю автотест...');

  exec('npx playwright test InedTest/Locators.spec.js --timeout=120000', {
    env: process.env,
    cwd: process.cwd(),
    maxBuffer: 1024 * 1024 * 10
  }, async (error, stdout, stderr) => {
    
    console.log('===== ПОЛНЫЙ ВЫВОД =====');
    console.log('STDOUT:', stdout);
    console.log('STDERR:', stderr);
    console.log('ERROR:', error);
    
      console.log('STDOUT:', stdout);
    console.log('STDERR:', stderr);
    
    // ✅ В Telegram отправляем только красиво
    if (error) {
      await sendMessage(`❌ <b>Тест провалился</b>\n\n${error.message}`);
      return;
    }
    
    await sendMessage('✅ Тест прошел успешно!');
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`);
  
  // ✅ ВОТ ЧТО НУЖНО ДОБАВИТЬ!
  if (webhookUrl) {
    try {
      await bot.deleteWebHook(); // удаляем старый
      await bot.setWebHook(`${webhookUrl}/bot${token}`); // ставим новый
      console.log(`✅ Webhook установлен: ${webhookUrl}/bot${token}`);
    } catch (err) {
      console.error('❌ Ошибка webhook:', err.message);
    }
  } else {
    console.warn('⚠️ WEBHOOK_URL не задан в .env!');
  }
});