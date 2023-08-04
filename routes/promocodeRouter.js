import express from "express";

import PromocodeController from "../controllers/promocodeController.js";
import promocodeMiddleware from "../middlewares/promocodeMiddleware.js";

const router = express();

router.post("/", PromocodeController.create);
router.delete("/", PromocodeController.delete);
router.post("/apply", promocodeMiddleware, PromocodeController.apply);
router.delete("/cancel", promocodeMiddleware, PromocodeController.cancel);

export default router;
