import express from "express";
import PromocodeController from "../controllers/promocodeController.js";
const router = express();

router.post("/", PromocodeController.create);
router.post("/check", PromocodeController.check);
router.delete("/", PromocodeController.delete);

export default router;
