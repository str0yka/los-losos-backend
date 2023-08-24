import express from "express";

import userController from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express();

router.post("/login", authMiddleware, userController.login);

export default router;
