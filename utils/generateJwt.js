import jwt from "jsonwebtoken";

export const generateJwt = (userId, cartId) => {
  return jwt.sign(
    {
      userId,
      cartId,
    },
    process.env.SECRET_KEY,
    { expiresIn: "7d" }
  );
};
