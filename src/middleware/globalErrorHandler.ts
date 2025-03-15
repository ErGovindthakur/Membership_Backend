import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import { myConfig } from "../config/config";

export const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message,
    errorStack: myConfig.env === "development" ? err.stack : "",
  });
};
