import express from "express";
import CategoryController from "../controllers/categoryController.js";
const router = express();

router.post("/", CategoryController.create);
router.get("/", CategoryController.getAll);
router.delete("/", CategoryController.delete);

export default router;
