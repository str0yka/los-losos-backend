import ApiError from "../error/ApiError.js";
import { prisma } from "../index.js";

class CartController {
  async addToCard(req, res, next) {
    try {
      const { cartId } = req.user;
      const { id } = req.body;
      const productId = id;
      const candidate = await prisma.productInCart.findFirst({
        where: { productId, cartId },
      });
      if (candidate) {
        const product = await prisma.productInCart.update({
          where: { id: candidate.id },
          data: { count: candidate.count + 1 },
        });
        return res.json(product);
      }
      const product = await prisma.productInCart.create({
        data: { cartId, productId, count: 1 },
      });
      return res.json(product);
    } catch (err) {
      next(ApiError.unexpected(err.message));
    }
  }

  async removeFromCart(req, res, next) {
    try {
      const { cartId } = req.user;
      const { id } = req.body;
      const productId = id;
      const candidate = await prisma.productInCart.findFirst({
        where: { productId, cartId },
      });
      if (candidate && candidate.count > 1) {
        const product = await prisma.productInCart.update({
          where: { id: candidate.id },
          data: { count: candidate.count - 1 },
        });
        return res.json(product);
      }
      const product = await prisma.productInCart.deleteMany({
        where: { productId, cartId },
      });
      return res.json(product);
    } catch (err) {
      next(ApiError.unexpected("Не удалось удалить товар из корзины"));
    }
  }

  async getAll(req, res, next) {
    try {
      const { cartId } = req.user;
      const { productInCart } = await prisma.cart.findFirst({
        where: { productInCart: { some: { cartId } } },
        include: {
          productInCart: {
            select: { product: true, count: true },
          },
        },
      });

      res.json(productInCart);
    } catch (err) {
      next(ApiError.badRequest("Корзина пуста"));
    }
  }
}

export default new CartController();
