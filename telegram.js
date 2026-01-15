import TelegramBot from 'node-telegram-bot-api';
import { exec } from 'child_process';
import { sendMessage, sendPhoto } from './telegramUtils.js';
import 'dotenv/config';
import express from 'express';
import { promisify } from 'util';

const execAsync = promisify(exec);

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
  const chatId = msg.chat.id;
  await sendMessage(chatId,'🚀 Запускаю автотест...');
 
  exec('npx playwright test tests/CreateObject.spec.js', {
    env: process.env,
    cwd: process.cwd(),
    maxBuffer: 1024 * 1024 * 10
  }, async (error, stdout, stderr) => {
    console.log('===== ПОЛНЫЙ ВЫВОД =====');
    console.log('STDOUT:', stdout);
    console.log('STDERR:', stderr);
    console.log('ERROR:', error);
    
    if (error) {
      await sendMessage(chatId,`❌ <b>Тест провалился</b>\n\n${error.message}`);
      return;
    }
    
    await sendMessage(chatId,'✅ Тест прошел успешно!');
  });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  console.log('🔧 Устанавливаю браузеры Playwright...');
  
  // try {
  //   const { stdout, stderr } = await execAsync('npx playwright install chromium');
  //   console.log('✅ Браузеры установлены!');
  //   console.log(stdout);
  //   if (stderr) console.log('STDERR:', stderr);
  // } catch (err) {
  //   console.error('❌ Ошибка установки браузеров:', err);
  // }

  app.listen(PORT, async () => {
    console.log(`Server listening on port ${PORT}`);
    
    if (webhookUrl) {
      try {
        await bot.deleteWebHook();
        await bot.setWebHook(`${webhookUrl}/bot${token}`);
        console.log(`✅ Webhook установлен: ${webhookUrl}/bot${token}`);
      } catch (err) {
        console.error('❌ Ошибка webhook:', err.message);
      }
    } else {
      console.warn('⚠️ WEBHOOK_URL не задан в .env!');
    }
  });
}

startServer();