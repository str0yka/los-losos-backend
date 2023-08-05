import { bot, botSendMessage } from "./index.js";
import { prisma } from "../index.js";

export const sendOrder = async (id, order) => {
  try {
    await botSendMessage(order, {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [
            {
              text: "🥘 Заказ готовится",
              callback_data: `change-order_status-to-cooking_${id}`,
            },
          ],
          [
            {
              text: "❌ Отменить заказ",
              callback_data: `change-order_cancel-order_${id}`,
            },
          ],
        ],
      }),
    });
  } catch (error) {
    console.log(error);
  }
};

bot.on("callback_query", async (message) => {
  try {
    const [action, handler, id] = message.data.split("_");
    const messageId = message.message.message_id;

    if (action === "change-order") {
      if (handler === "status-to-cooking") {
        await prisma.order.update({
          where: { cartId: Number(id) },
          data: { status: "inWork" },
        });

        await bot.editMessageReplyMarkup(
          {
            inline_keyboard: [
              [
                {
                  text: "🚚 Заказ в пути",
                  callback_data: `change-order_status-to-delivery_${id}`,
                },
              ],
              [
                {
                  text: "❌ Отменить заказ",
                  callback_data: `change-order_cancel-order_${id}`,
                },
              ],
            ],
          },
          {
            chat_id: process.env.CHAT_ID,
            message_id: messageId,
          }
        );
        return;
      }

      if (handler === "status-to-delivery") {
        await prisma.order.update({
          where: { cartId: Number(id) },
          data: { status: "enRoute" },
        });

        await bot.editMessageReplyMarkup(
          {
            inline_keyboard: [
              [
                {
                  text: "✅ Заказ доставлен",
                  callback_data: `change-order_status-to-confirm_${id}`,
                },
              ],
              [
                {
                  text: "❌ Отменить заказ",
                  callback_data: `change-order_cancel-order_${id}`,
                },
              ],
            ],
          },
          {
            chat_id: process.env.CHAT_ID,
            message_id: messageId,
          }
        );
        return;
      }

      if (handler === "status-to-confirm") {
        await prisma.order.update({
          where: { cartId: Number(id) },
          data: { status: "delivered", whenDelivered: new Date(Date.now()) },
        });

        await bot.editMessageReplyMarkup(null, {
          chat_id: process.env.CHAT_ID,
          message_id: messageId,
        });

        await bot.editMessageText("🟢 доставлен \n" + message.message.text, {
          chat_id: process.env.CHAT_ID,
          message_id: messageId,
        });

        return;
      }

      if (handler === "cancel-order") {
        await prisma.order.update({
          where: { cartId: Number(id) },
          data: { status: "canceled", whenDelivered: new Date(Date.now()) },
        });

        await bot.editMessageReplyMarkup(null, {
          chat_id: process.env.CHAT_ID,
          message_id: messageId,
        });

        await bot.editMessageText("🔴 отменен \n" + message.message.text, {
          chat_id: process.env.CHAT_ID,
          message_id: messageId,
        });

        return;
      }
    }
  } catch (error) {
    console.log(error);
  }
});
