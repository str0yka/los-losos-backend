import TelegramApi from "node-telegram-bot-api";
import { sendOrder } from "./orders.js";

export const bot = new TelegramApi(process.env.BOT_TOKEN, { polling: true });

export const botSendMessage = async (message, form) =>
  await bot.sendMessage(process.env.CHAT_ID, message, {
    ...form,
    parse_mode: "HTML",
  });
