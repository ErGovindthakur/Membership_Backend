import { Router } from "express";
import { createBook } from "./bookController";
import multer from "multer";
import path from "node:path";

// multer working functionality
// local file store ->

const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 3e7 }, // 30mb -> 30 * 1024 * 1024
});

const bookRouter = Router();

bookRouter.post(
  "/createBook",
  upload.fields([
    { name: "coverImg", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);

export default bookRouter;
