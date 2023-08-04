import jwt from "jsonwebtoken";

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
      req.user = { isAuthorize: true, cartId: decoded.cartId };
    } else {
      req.user = { isAuthorize: false, cartId: decoded.cartId };
    }

    return next();
  } catch (err) {
    return res.status(500).json({ err });
  }
}
