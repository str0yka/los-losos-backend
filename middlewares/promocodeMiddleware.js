import jwt from "jsonwebtoken";
import { prisma } from "../index.js";
import ApiError from "../error/ApiError.js";

export default async function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    let token = null;
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token || token === "null") {
      throw new Error("Отсутствует корзина");
    }

    const decoded = jwt.decode(token);

    if (decoded.userId) {
      const { cartId } = await prisma.user.findFirst({
        where: { id: decoded.userId },
      });

      req.user = { userId: decoded.userId, cartId };
      return next();
    }

    req.user = decoded;

    return next();
  } catch (err) {
    return res.json(ApiError.unexpected(err?.message ?? 'Ошибка при взаимодействии с промокодом'))
  }
}
