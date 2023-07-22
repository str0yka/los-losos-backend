import express from "express";
import cartMiddleware from "../middlewares/cartMiddleware.js";
import cartController from "../controllers/cartController.js";
const router = express();

router.post("/", cartMiddleware, cartController.addToCard);
router.delete("/", cartMiddleware, cartController.removeFromCart);
router.delete("/one", cartMiddleware, cartController.removeItemFromCart);
router.delete("/all", cartMiddleware, cartController.removeAllFromCart);
router.get("/", cartController.getAll);

export default router;
