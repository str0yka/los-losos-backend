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

    if (!token || token === "null") {
      const cart = await prisma.cart.create({ data: {} });
      req.user = { isAuthorize: false, cartId: cart.id };
      return next();
    }

    const decoded = jwt.decode(token);

    if (decoded.phone) {
      req.user = { isAuthorize: true, cartId: decoded.cartId };
    } else {
      req.user = { isAuthorize: false, cartId: decoded.cartId };
    }

    return next();
  } catch (err) {
    return res.status(500).json({ err });
  }
}
