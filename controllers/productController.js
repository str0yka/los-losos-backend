import path from "path";
import fs from "fs";

import { prisma } from "../index.js";
import ApiError from "../error/ApiError.js";
import { v4 as uuidv4 } from "uuid";
import { __dirname } from "../index.js";

class ProductController {
  async create(req, res, next) {
    try {
      console.log('body', req.body)
      console.log('files', req.files)
      let { title, foods, price, weight, categoryId } = req.body;
      const { img } = req.files;
      foods = JSON.parse(foods);

      if (!title) return next(ApiError.badRequest("Не указано название"));
      if (!img) return next(ApiError.badRequest("Не выбрана картинка"));
      if (!foods || !Array.isArray(foods))
        return next(ApiError.badRequest("Не указаны продукты"));
      if (!price) return next(ApiError.badRequest("Не указана цена"));
      if (!weight) return next(ApiError.badRequest("Не указан вес"));
      if (!categoryId) return next(ApiError.badRequest("Не указана категория"));

      const fileName = uuidv4() + ".jpg";
      img.mv(path.resolve(__dirname, "static", fileName));

      foods = foods.join(", ");
      price = Number(price);
      weight = Number(weight);
      categoryId = Number(categoryId);

      const product = await prisma.product.create({
        data: { title, img: fileName, foods, price, weight, categoryId },
      });
      return res.status(200).json(product);
    } catch (error) {
      console.log('product/create', error);
      next(ApiError.badRequest("Не удалось создать продукт"));
    }
  }

  async getAll(req, res) {
    try {
      const data = await prisma.category.findMany({
        select: { products: true, title: true },
      });
      return res.json(data);
    } catch (error) {
      next(ApiError.unexpected('Ошибка при получение всех товаров'))
    }
  }

  async getOne(req, res) {
    try {
      let { id } = req.params;
      id = Number(id);
      const data = await prisma.product.findFirst({ where: { id } });
      return res.json(data);
    } catch (error) {
      next(ApiError.unexpected('Ошибка при получение товара'))
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.body;

      if (!id) return next(ApiError.badRequest("Не выбрана категория"));

      const { img } = await prisma.product.findFirst({
        where: { id },
        select: { img: true },
      });
      const product = await prisma.product.delete({ where: { id } });
      fs.unlink(`${__dirname}/static/${img}`, (err) => {
        if (err) throw err;
        console.log("Файл удален");
      });
      return res.json(product);
    } catch (error) {
      console.log('product/delete', error)
      next(ApiError.unexpected('Не удалось удалить продукт'))
    }
  }
}

export default new ProductController();
