import express from "express";
import cartMiddleware from "../middlewares/cartMiddleware.js";
import cartController from "../controllers/cartController.js";
const router = express();

router.get("/", cartMiddleware, cartController.getAll);
router.post("/", cartMiddleware, cartController.addToCard);
router.delete("/", cartMiddleware, cartController.removeFromCart);
router.delete("/one", cartMiddleware, cartController.removeItemFromCart);
router.delete("/all", cartMiddleware, cartController.removeAllFromCart);
router.post("/confirm", cartMiddleware, cartController.confirm);

export default router;
