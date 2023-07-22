import { prisma } from "../index.js";
import jwt from "jsonwebtoken";

import ApiError from "../error/ApiError.js";
import { generateJwt } from "../utils/generateJwt.js";

class CartController {
  async addToCard(req, res, next) {
    try {
      const { isAuthorize, cartId } = req.user;
      const { id } = req.body;
      const productId = id;

      const token = isAuthorize ? null : generateJwt(cartId);

      const candidate = await prisma.productInCart.findFirst({
        where: { productId, cartId },
      });

      if (candidate) {
        var { product, count } = await prisma.productInCart.update({
          where: { id: candidate.id },
          data: { count: candidate.count + 1 },
          select: { product: true, count: true },
        });
      } else {
        console.log(cartId, productId);
        var { product, count } = await prisma.productInCart.create({
          data: { cartId, productId, count: 1 },
          select: { product: true, count: true },
        });
      }

      return res.json({ isAuthorize, token, product, count });
    } catch (err) {
      next(ApiError.unexpected(err.message));
    }
  }

  async removeFromCart(req, res, next) {
    try {
      const { isAuthorize, cartId } = req.user;
      const productId = req.body.id;

      const token = isAuthorize ? null : generateJwt(cartId);

      const candidate = await prisma.productInCart.findFirst({
        where: { productId, cartId },
        select: { product: true, count: true, id: true },
      });

      if (candidate && candidate.count > 1) {
        var { product } = await prisma.productInCart.update({
          where: { id: candidate.id },
          data: { count: candidate.count - 1 },
          select: { product: true, count: true },
        });
      } else {
        var product = await prisma.productInCart.deleteMany({
          where: { cartId, productId },
        });
      }

      return res.json({
        isAuthorize,
        token,
        product: candidate.product,
        count: candidate.count - 1,
      });
    } catch (err) {
      next(ApiError.unexpected("Не удалось удалить товар из корзины"));
    }
  }

  async removeAllFromCart(req, res, next) {
    try {
      const { cartId } = req.user;
      console.log(cartId);
      await prisma.productInCart.deleteMany({ where: { cartId } });
      return res.json({ success: true });
    } catch (err) {
      console.log(err);
      return res.json({ success: false });
    }
  }

  async removeItemFromCart(req, res, next) {
    try {
      const { cartId } = req.user;
      const productId = req.body.id;

      const product = await prisma.productInCart.deleteMany({
        where: { cartId, productId },
      });

      console.log(product, cartId, productId);

      return res.json({ success: true });
    } catch (err) {
      console.log(err);
      return res.json({ success: false });
    }
  }

  async getAll(req, res, next) {
    try {
      const { cartId } = jwt.decode(req.headers.authorization.split(" ")[1]);

      if (!cartId) return next(ApiError.badRequest("Корзины не существует"));

      const { productsInCart } = await prisma.cart.findFirst({
        where: { id: cartId },
        include: {
          productsInCart: {
            select: { product: true, count: true },
          },
        },
      });

      res.json(productsInCart);
    } catch (err) {
      next(ApiError.badRequest("Корзина пуста"));
    }
  }
}

export default new CartController();
