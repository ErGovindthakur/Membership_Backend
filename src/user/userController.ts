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

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    // 1. validation
    if (!email || !password) {
      return next(createHttpError(400, "All fields are required"));
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return next(createHttpError(404, "User does not exist with this email"));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(createHttpError(401, "user name or password incorrect"));
    }

    // 2. Process

    const token = await jwt.sign(
      { sub: user._id },
      myConfig.jwtSecret as string,
      { expiresIn: "1d", algorithm: "HS256" }
    );

    res.status(200).json({
      message: "User login successfully",
      accessToken: token,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while login user" + error));
  }
};
export { createUser, loginUser };
