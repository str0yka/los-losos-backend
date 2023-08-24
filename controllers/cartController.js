import ApiError from "../error/ApiError.js";
import { prisma } from "../index.js";
import { generateJwt } from "../utils/generateJwt.js";
import { sendOrder } from "../telegram/orders.js";

class CartController {
  async addToCard(req, res, next) {
    try {
      const { userId, cartId } = req.user;
      const { productId } = req.body;

      const token = userId ? null : generateJwt(null, null, cartId);

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
        var { product, count } = await prisma.productInCart.create({
          data: { cartId, productId, count: 1 },
          select: { product: true, count: true },
        });
      }

      return res.json({ userId, token, product, count });
    } catch (err) {
      next(ApiError.unexpected(err.message));
    }
  }

  async removeFromCart(req, res, next) {
    try {
      const { userId, cartId } = req.user;
      const { productId } = req.body;

      const token = userId ? null : generateJwt(null, null, cartId);

      const candidate = await prisma.productInCart.findFirst({
        where: { productId, cartId },
        select: { product: true, count: true, id: true },
      });

      if (candidate && candidate.count > 1) {
        await prisma.productInCart.update({
          where: { id: candidate.id },
          data: { count: candidate.count - 1 },
          select: { product: true, count: true },
        });
      } else {
        await prisma.productInCart.deleteMany({
          where: { cartId, productId },
        });
      }

      return res.json({
        userId,
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
      await prisma.productInCart.deleteMany({ where: { cartId } });
      return res.json({ success: true });
    } catch (err) {
      return next(ApiError.unexpected('Ошибка при удаление товаров из корзины'));
    }
  }

  async removeItemFromCart(req, res, next) {
    try {
      const { cartId } = req.user;
      const { productId } = req.body;

      const product = await prisma.productInCart.deleteMany({
        where: { cartId, productId },
      });

      return res.json({ success: true });
    } catch (err) {
      return next(ApiError.unexpected('Ошибка при удаление товаров из корзины'));
    }
  }

  async getAll(req, res, next) {
    try {
      const { cartId } = req.user;

      if (!cartId) return next(ApiError.badRequest("Корзины не существует"));

      const { productsInCart, promocode } = await prisma.cart.findFirst({
        where: { id: cartId },
        include: {
          productsInCart: {
            select: { product: true, count: true },
          },
          promocode: true,
        },
      });

      res.json({ productsInCart, promocode });
    } catch (err) {
      console.log(err)
      next(ApiError.badRequest("Корзина пуста"));
    }
  }

  async confirm(req, res, next) {
    try {
      const { userId, cartId } = req.user;
      const {
        name,
        phone,
        street,
        home,
        building,
        entrance,
        floor,
        apartment,
        addressComment,
        orderComment,
      } = req.body;

      if (!cartId) {
        return next(ApiError.badRequest("Ошибка при оформление заказа"));
      }

      if (!userId) {
        return next(ApiError.badRequest("Пользователь не авторизован"));
      }

      const prevCart = await prisma.cart.findFirst({
        where: { id: cartId },
        select: {
          productsInCart: { select: { product: true, count: true } },
          promocode: true,
        },
      });
      if (!prevCart.productsInCart.length) {
        return next(ApiError.badRequest("Корзина пуста"));
      }

      await prisma.order.create({
        data: { userId, cartId, status: "accepted" },
      });
      const newCart = await prisma.cart.create({});

      await prisma.user.update({
        where: { id: userId },
        data: { cartId: newCart.id },
      });

      const formData = [
        `#заказ №${cartId}`,
        `Имя: <b>${name}</b>`,
        `Телефон: <a href="tel:${phone}">${phone}</a>`,
        `Улица: <b>${street} д. ${home}</b>`,
        `Строение: <b>${building || "отсутсвует"}</b>`,
        `Подъезд: <b>${entrance || "отсутсвует"}</b>`,
        `Этаж: <b>${floor || "отсутсвует"}</b>`,
        `Квартира: <b>${apartment || "отсутсвует"}</b>`,
        `Комментарий к адрессу: <b>${addressComment || "отсутсвует"}</b>`,
        `Комментарий к заказу: <b>${orderComment || "отсутсвует"}</b>`,
      ];

      const products = prevCart.productsInCart.map(
        (productInCart) =>
          `${productInCart.product.title} — ${productInCart.count} шт. — ` +
          `<b>${productInCart.product.price * productInCart.count} руб.</b>`
      );

      const totalPrice = prevCart.productsInCart.reduce(
        (accum, productInCart) =>
          accum + productInCart.product.price * productInCart.count,
        0
      );

      let promocode = { code: null, discount: 0 };
      if (prevCart.promocode) {
        promocode.code = prevCart.promocode.code;
        if (prevCart.promocode.discountType === "fix") {
          promocode.discount = prevCart.promocode.value;
        } else {
          promocode.discount = Math.round(
            totalPrice * (prevCart.promocode.value / 100)
          );
        }
      }

      const isDeliveryFree =
        totalPrice >= Number(process.env.PRICE_FOR_FREE_DELIVERY);
      const deliveryPrice = isDeliveryFree
        ? 0
        : Number(process.env.DELIVERY_PRICE);

      const check = [
        `Промокод — ${
          promocode.code
            ? `${promocode.code} — <b>${promocode.discount} руб.</b>`
            : "отсутствует"
        }`,
        `Доставка — <b>${deliveryPrice} руб.</b>`,
        `К оплате — <b>${
          totalPrice + deliveryPrice - promocode.discount
        } руб.</b>`,
      ];

      await sendOrder(
        cartId,
        formData.join("\n") +
          "\n\n" +
          products.join("\n") +
          "\n\n" +
          check.join("\n")
      );

      return res.json({
        success: true,
        prevCartId: cartId,
        newCartId: newCart.id,
      });
    } catch (err) {
      console.log('cart/confirm', err);
      next(ApiError.badRequest("Ошибка при оформление заказа"));
    }
  }

  async getOrders(req, res, next) {
    try {
      const { userId } = req.user;

      if (!userId) {
        return next(ApiError.badRequest("Пользователя не существует"));
      }

      const { orders } = await prisma.user.findFirst({
        where: { id: userId },
        select: {
          orders: {
            select: {
              status: true,
              cart: {
                select: {
                  id: true,
                  productsInCart: {
                    select: {
                      product: { select: { title: true } },
                      count: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return res.json(orders);
    } catch (err) {
      console.log('cart/getorders', err);
      next(ApiError.badRequest("Ошибка при получение заказов"));
    }
  }
}

export default new CartController();
