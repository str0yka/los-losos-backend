import ApiError from "../error/ApiError.js";
import { prisma } from "../index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateJwt = (id, cartId, role) => {
  return jwt.sign(
    {
      id,
      cartId,
      role,
    },
    process.env.SECRET_KEY,
    { expiresIn: "7d" }
  );
};

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
    const { phone, password } = req.body;
    const user = await prisma.user.findFirst({ where: { phone } });
    if (!user) {
      return next(ApiError.badRequest("Неверно указана почта или пароль"));
    }
    const comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.badRequest("Неверно указана почта или пароль"));
    }
    const token = generateJwt(user.id, user.cartId, user.role);
    return res.json({ token });
  }

  async checkAuth(req, res, next) {
    const token = generateJwt(req.user.id, req.user.cartId, req.user.role);
    res.json({ token });
  }
}

export default new UserController();
