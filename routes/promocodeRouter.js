import express from "express";

import PromocodeController from "../controllers/promocodeController.js";
import promocodeMiddleware from "../middlewares/promocodeMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express();

router.post("/apply", promocodeMiddleware, PromocodeController.apply);
router.delete("/cancel", promocodeMiddleware, PromocodeController.cancel);
router.get("/", authMiddleware, adminMiddleware, PromocodeController.getAll);
router.post("/", authMiddleware, adminMiddleware, PromocodeController.create);
router.delete("/", authMiddleware, adminMiddleware, PromocodeController.delete);

export default router;
