import jwt from "jsonwebtoken";

export const generateJwt = (userId, role, cartId) => {
  return jwt.sign(
    {
      userId,
      role,
      cartId,
    },
    process.env.SECRET_KEY,
    { expiresIn: "7d" }
  );
};
