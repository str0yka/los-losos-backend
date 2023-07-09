import express from "express";
import productController from "../controllers/productController.js";
const router = express();

router.post("/", productController.create);
router.get("/", productController.getAll);
router.get("/:id", productController.getOne);
router.delete("/", productController.delete);

export default router;
