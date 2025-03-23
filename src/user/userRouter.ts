import express from "express";
import { createUser, loginUser, logoutUser } from "./userController";
import authenticate from "../middleware/authenticate";

const userRouter = express.Router();

// routes

userRouter.post("/register",createUser);
userRouter.post("/login",loginUser);
userRouter.get("/logout",authenticate,logoutUser);

export default userRouter;
