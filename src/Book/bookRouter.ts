import { Router } from "express";
import { createBook, deleteBook, getAllBooks, getSingleBook, updateBook } from "./bookController";
import multer from "multer";
import path from "node:path";
import authenticate from "../middleware/authenticate";

// multer working functionality
// local file store ->

const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 3e7 }, // 30mb -> 30 * 1024 * 1024
});

const bookRouter = Router();

bookRouter.post(
  "/createBook",
  authenticate,
  upload.fields([
    { name: "coverImg", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);

bookRouter.patch(
  "/updateBook/:bookId",
  authenticate,
  upload.fields([
    {
      name: "coverImg",
      maxCount: 1,
    },
    {
      name: "file",
      maxCount: 1,
    },
  ]),
  updateBook
);

bookRouter.get("/getAllBooks",getAllBooks);
bookRouter.get("/getSingleBook/:bookId",getSingleBook);
bookRouter.delete("/deleteBook/:bookId",authenticate,deleteBook)

export default bookRouter;
