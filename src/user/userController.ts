import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

const createUser = async (req: Request, res: Response, next: NextFunction) => {

     const {name,email,password} = req.body;
     // 1. validation
     if(!name || !email || !password){
          const error = createHttpError(400,"All Fields are required");
          return next(error);
     }
     
     // 2. process
     // 3. Response
  res.json({
    message: "user created",
  });
};

export { createUser };
