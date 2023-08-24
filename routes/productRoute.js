import express from "express";

import productController from "../controllers/productController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express();

router.get("/", productController.getAll);
router.get("/:id", productController.getOne);
router.post("/", authMiddleware, adminMiddleware, productController.create);
router.delete("/", authMiddleware, adminMiddleware, productController.delete);

export default router;
