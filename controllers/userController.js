import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import ApiError from "../error/ApiError.js";
import { prisma } from "../index.js";
import { generateJwt } from "../utils/generateJwt.js";

class UserController {
  async registration(req, res, next) {
    let { phone, password, role } = req.body;
    if (!phone || !password || phone.length > 10) {
      return next(ApiError.badRequest("Некорректная почта или пароль"));
    }
    if (!role) role = "user";
    const candidate = await prisma.user.findFirst({ where: { phone } });
    if (candidate) {
      return next(
        ApiError.badRequest(
          "Пользователь с таким номером телефона уже существует"
        )
      );
    }
    const cart = await prisma.cart.create({ data: {} });
    const hashPasswrod = await bcrypt.hash(password, 5);
    const user = await prisma.user.create({
      data: { phone, password: hashPasswrod, role, cartId: cart.id },
    });
    const token = generateJwt(user.id, user.role, cart.id, role);
    return res.json({ token });
  }

  async login(req, res, next) {
    try {
      let { phone, code } = req.body;
      let cartId;
      if (req.headers.authorization) {
        cartId = jwt.decode(req.headers.authorization.split(" ")[1]);
      }

      if (String(code) !== process.env.SECRET_CODE) {
        return next(ApiError.badRequest("Неверный код"));
      }

      const candidate = await prisma.user.findFirst({ where: { phone } });

      if (candidate) {
        const accessToken = generateJwt(candidate.id, candidate.role, candidate.cartId);

        return res.json({ ...candidate, accessToken });
      }

      if (!cartId) {
        const { id } = await prisma.cart.create({ select: { id: true } });
        cartId = id;
      }

      const user = await prisma.user.create({ data: { phone, cartId } });

      const accessToken = generateJwt(user.id, user.role, user.cartId);
      res.json({ ...user, accessToken });
    } catch (error) {
      console.log('user', error);
      next(ApiError.unexpected("Непредвиденная ошибка при авторизации"));
    }
  }

  async checkAuth(req, res, next) {
    const token = generateJwt(req.user.id, req.user.role, req.user.cartId);
    res.json({ token });
  }
}

export default new UserController();
