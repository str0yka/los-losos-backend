import { prisma } from "../index.js";
import ApiError from "../error/ApiError.js";

class CategoryController {
  async create(req, res, next) {
    const { title } = req.body;

    if (!title) return next(ApiError.badRequest("Не указано название"));

    const category = await prisma.category.create({ data: { title } });
    return res.status(200).json(category);
  }

  async getAll(req, res) {
    const data = await prisma.category.findMany();
    return res.json(data);
  }

  async delete(req, res, next) {
    const { id } = req.body;

    if (!id) return next(ApiError.badRequest("Не выбрана категория"));

    const category = await prisma.category.delete({ where: { id } });
    return res.json(category);
  }
}

export default new CategoryController();
