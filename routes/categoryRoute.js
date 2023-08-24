import express from "express";

import CategoryController from "../controllers/categoryController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express();

router.get("/", CategoryController.getAll);
router.post("/", authMiddleware, adminMiddleware, CategoryController.create);
router.delete("/", authMiddleware, adminMiddleware, CategoryController.delete);

export default router;
