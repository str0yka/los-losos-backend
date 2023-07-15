import ApiError from "../error/ApiError.js";
import { prisma } from "../index.js";
import bcrypt from "bcrypt";
import { generateJwt } from "../utils/generateJwt.js";
import jwt from "jsonwebtoken";

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
    const token = generateJwt(user.id, cart.id, role);
    return res.json({ token });
  }

  async login(req, res, next) {
    let { phone, code } = req.body;
    let cartId;
    if (req.headers.authorization) {
      cartId = jwt.decode(req.headers.authorization.split(" ")[1]);
    }

    console.log(phone, code, cartId);

    if (String(code) !== process.env.SECRET_CODE) {
      return next(ApiError.badRequest("Неверный код"));
    }

    const candidate = await prisma.user.findFirst({ where: { phone } });

    if (candidate) {
      const accessToken = generateJwt(candidate.cartId);

      return res.json({ ...candidate, accessToken });
    }

    if (!cartId) {
      const { id } = await prisma.cart.create({ select: { id: true } });
      cartId = id;
    }

    const accessToken = generateJwt(cartId);

    const user = await prisma.user.create({ data: { phone, cartId } });
    res.json({ ...user, accessToken });
  }

  async checkAuth(req, res, next) {
    const token = generateJwt(req.user.id, req.user.cartId, req.user.role);
    res.json({ token });
  }
}

export default new UserController();
