import { Router } from "express";
import { createBook } from "./bookController";

const bookRouter = Router();

bookRouter.post("/createBook",createBook);

export default bookRouter;