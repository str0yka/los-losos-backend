import jwt from "jsonwebtoken";

export const generateJwt = (cartId) => {
  return jwt.sign(
    {
      cartId,
    },
    process.env.SECRET_KEY,
    { expiresIn: "7d" }
  );
};
