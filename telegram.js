import TelegramBot from 'node-telegram-bot-api';
import { exec } from 'child_process';
import { sendMessage, sendPhoto } from './telegramUtils.js'; // если telegram.js в корне
import 'dotenv/config';

const token = process.env.TELEGRAM_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
const webhookUrl = process.env.WEBHOOK_URL;
const bot = new TelegramBot(token);

const app = express();
app.use(express.json());
// Регистрируем webhook
bot.setWebHook(`${webhookUrl}/bot${token}`);

app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));