import jwt from "jsonwebtoken";
import { prisma } from "../index.js";

export default async function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    let token = null;
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      const cart = await prisma.cart.create({ data: {} });
      const user = await prisma.user.create({
        data: { role: "user", cartId: cart.id },
      });
      req.user = user;
      return next();
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(500).json({ err });
  }
}
