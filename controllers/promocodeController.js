import ApiError from "../error/ApiError.js";
import { prisma } from "../index.js";

class PromocodeController {
  async create(req, res, next) {
    try {
      const { code, name, text, type, value } = req.body;
      if (!code || !type || !value)
        return next(
          ApiError.badRequest("Передайте все обязательные свойства промокода.")
        );

      const promocode = await prisma.promocode.create({
        data: { code, name, text, type, value },
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

  async check(req, res, next) {
    try {
      const { code } = req.body;
      if (!code) return next(ApiError.badRequest("Укажите промокод"));

      const promocode = await prisma.promocode.findFirst({ where: { code } });
      if (!promocode)
        return next(ApiError.badRequest("Такого промокода не существует"));

      return res.json(promocode);
    } catch (error) {
      console.log(error);
      next(ApiError.unexpected("Неизвестная ошибка проверки промокода."));
    }
  }
}

export default new PromocodeController();
