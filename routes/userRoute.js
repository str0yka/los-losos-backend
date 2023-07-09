import express from "express";
import userController from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express();

router.post("/register", userController.registration);
router.post("/login", userController.login);
router.get("/", authMiddleware, userController.checkAuth);

export default router;
