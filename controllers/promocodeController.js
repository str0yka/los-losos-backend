import ApiError from "../error/ApiError.js";
import { prisma } from "../index.js";

class PromocodeController {
  async create(req, res, next) {
    try {
      const { code, name, text, discountType, value, expireType, date, count } =
        req.body;
      if (
        !code ||
        !discountType ||
        !value ||
        (expireType === "date" && !date) ||
        (expireType === "count" && !count)
      ) {
        return next(
          ApiError.badRequest("Передайте все обязательные свойства промокода.")
        );
      }

      let counter;
      if (expireType === "count") {
        if (typeof count !== "number") {
          return next(
            ApiError.badRequest(
              "Укажите корректное допустимое количество использования промокода."
            )
          );
        }
        counter = 0;
      }

      const promocode = await prisma.promocode.create({
        data: {
          code,
          name,
          text,
          discountType,
          value,
          expireType,
          date,
          count,
          counter,
        },
      });

      return res.json(promocode);
    } catch (error) {
      console.log(error);
      next(ApiError.unexpected("Неизвестная ошибка при создании промокода."));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.body;
      if (!id) return next(ApiError.badRequest("Промокод не выбран."));

      await prisma.promocode.delete({ where: { id } });

      return res.json({ success: true });
    } catch (error) {
      console.log(error);
      next(ApiError.unexpected("Неизвестная ошибка при удалении промокода."));
    }
  }

  async apply(req, res, next) {
    try {
      const { code } = req.body;
      const { userId, cartId } = req.user;
      if (!code || !userId) return next(ApiError.badRequest("Не указан промокод или пользователь неавторизован"));

      let promocode = await prisma.promocode.findFirst({ where: { code } });

      if (!promocode) {
        return next(ApiError.badRequest("Такого промокода не существует"));
      }

      if (promocode.expireType === "count") {
        if (promocode.counter >= promocode.count) {
          await prisma.promocode.delete({ where: { id: promocode.id } });
          return next(
            ApiError.badRequest("Количество использований промокода исчерпано")
          );
        }

        const candidate = await prisma.cart.findFirst({
          where: { id: cartId },
        });

        if (candidate.promocodeId) {
          await prisma.promocode.update({
            where: { id: candidate.promocodeId },
            data: { counter: { decrement: 1 } },
          });
        }

        promocode = await prisma.promocode.update({
          where: { id: promocode.id },
          data: { counter: { increment: 1 } },
        });
      }

      if (
        promocode.expireType === "date" &&
        Date.now() > Date.parse(promocode.date)
      ) {
        await prisma.promocode.delete({ where: { id: promocode.id } });
        return next(
          ApiError.badRequest("Количество использований промокода исчерпано")
        );
      }

      await prisma.cart.update({
        where: { id: cartId },
        data: { promocodeId: promocode.id },
      });

      return res.json(promocode);
    } catch (error) {
      console.log(error);
      next(ApiError.unexpected("Неизвестная ошибка проверки промокода."));
    }
  }

  async cancel(req, res, next) {
    try {
      const { userId, cartId } = req.user;

      if (!cartId || !userId) {
        return next(ApiError.badRequest("Ошибка авторизации"));
      }

      const { promocodeId } = await prisma.cart.findFirst({
        where: { id: cartId }
      });

      await prisma.promocode.update({
        where: { id: promocodeId },
        data: { counter: { decrement: 1 } }
      })

      await prisma.cart.update({
        where: { id: cartId },
        data: { promocodeId: null }
      })

      return res.json({ success: true });
    } catch (error) {
      next(ApiError.unexpected("Неизвестная ошибка проверки промокода."));
    }
  }

  async getAll(req, res, next) {
    try {
      const promocodes = await prisma.promocode.findMany()
      res.json(promocodes)
    } catch (error) {
      next(ApiError.unexpected('Незвестная ошибка при получение промокодов.'))
    }
  }
}

export default new PromocodeController();
