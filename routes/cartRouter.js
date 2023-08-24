import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";
import cartController from "../controllers/cartController.js";

const router = express();

router.get("/", authMiddleware, cartController.getAll);
router.post("/", authMiddleware, cartController.addToCard);
router.delete("/", authMiddleware, cartController.removeFromCart);
router.delete("/one", authMiddleware, cartController.removeItemFromCart);
router.delete("/all", authMiddleware, cartController.removeAllFromCart);
router.post("/confirm", authMiddleware, cartController.confirm);
router.get("/orders", authMiddleware, cartController.getOrders);

export default router;
