import express from "express";
import cartMiddleware from "../middlewares/cartMiddleware.js";
import cartController from "../controllers/cartController.js";
const router = express();

router.post("/", cartMiddleware, cartController.addToCard);
router.delete("/", cartMiddleware, cartController.removeFromCart);
router.get("/", cartController.getAll);

export default router;
