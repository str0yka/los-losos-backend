import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import express from "express";
import fileUpload from "express-fileupload";
import { PrismaClient } from "@prisma/client";

import errorHandlingMiddleware from "./middlewares/ErrorHandlingMiddleware.js";
import router from "./routes/index.js";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
export const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "static")));
app.use(fileUpload({}));
app.use("/api", router);
app.use(errorHandlingMiddleware);

const start = async () => {
  try {
    await prisma.$connect();
    app.listen(process.env.PORT, () => {
      console.log(`Server started on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.log('start', err);
  }
};
start();
