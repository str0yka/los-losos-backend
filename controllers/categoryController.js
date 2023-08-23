import { prisma } from "../index.js";
import ApiError from "../error/ApiError.js";

class CategoryController {
  async create(req, res, next) {
    try {
      const { title } = req.body;

      if (!title) return next(ApiError.badRequest("Не указано название"));

      const category = await prisma.category.create({ data: { title } });
      return res.status(200).json(category);
    } catch (error) {
      next(ApiError.unexpected('Не удалось удалить категорию'))
    }
  }

  async getAll(req, res) {
    try {
      const data = await prisma.category.findMany();
      return res.json(data);
    } catch (error) {
      next(ApiError.unexpected('Не удалось получить категории'))
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.body;

      if (!id) return next(ApiError.badRequest("Не выбрана категория"));

      const category = await prisma.category.delete({ where: { id } });
      return res.json(category);
    } catch (error) {
      next(ApiError.unexpected('Не удалось удалить категорию'))
    }
  }
}

export default new CategoryController();
