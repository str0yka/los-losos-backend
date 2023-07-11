import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import cartController from "../controllers/cartController.js";
const router = express();

router.post("/", authMiddleware, cartController.addToCard);
// router.post("/", userController.login);
router.delete("/", authMiddleware, cartController.removeFromCart);
router.get("/", authMiddleware, cartController.getAll);

export default router;
