import express from "express";

import categoryRoute from "./categoryRoute.js";
import productRoute from "./productRoute.js";
import userRoute from "./userRoute.js";
import cartRouter from "./cartRouter.js";
import promocodeRouter from "./promocodeRouter.js";

const router = new express();

router.use("/user", userRoute);
router.use("/category", categoryRoute);
router.use("/product", productRoute);
router.use("/cart", cartRouter);
router.use("/promocode", promocodeRouter);

export default router;
