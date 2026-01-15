import dotenv from 'dotenv';
dotenv.config();

import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(token, { polling: false });

export const sendMessage = async (chatId, message) => {
  try {
    await bot.sendMessage(chatId, message, {
      parse_mode: 'HTML',
    });
  } catch (err) {
    console.error('Telegram sendMessage error:', err);
  }
};

export const sendPhoto = async (chatId, filePath, caption = '') => {
  try {
    await bot.sendPhoto(chatId, filePath, {
      caption,
      parse_mode: 'HTML',
      contentType: 'image/jpeg',
    });
  } catch (err) {
    console.error('Telegram sendPhoto error:', err);
  }
};