import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "./userModel";
import { myConfig } from "../config/config";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  try {
    // 1. validation
    if (!name || !email || !password) {
      const error = createHttpError(400, "All Fields are required");
      return next(error);
    }
    // Database call
    const user = await userModel.findOne({ email });

    if (user) {
      const error = createHttpError(400, "User already exist with this email");
      return next(error);
    }

    // password -> Hashed Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user

    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    // 2. process

    // token generation (jwt token)
    const token = await jwt.sign(
      { sub: newUser._id },
      myConfig.jwtSecret as string,
      { expiresIn: "1d" }
    );
    // 3. Response
    res.status(201).json({
      message: "user created successfully",
      accessToken: token,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while Register user" + error));
  }
};


