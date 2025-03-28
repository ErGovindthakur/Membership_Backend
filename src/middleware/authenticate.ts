import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { myConfig } from "../config/config";

export interface AuthRequest extends Request {
     userId:string
}
const authenticate = (req: Request, res: Response, next: NextFunction) => {
     const token = req.header("Authorization");
     if(!token){
          return next(createHttpError(401,"Authorization failed"))
     }

     const parsedToken = token.split(' ')[1];

     const decoded = jwt.verify(parsedToken, myConfig.jwtSecret as string) ;

     console.log(decoded);

     const _req = req as AuthRequest;
     _req.userId = decoded.sub as string;
     
     next();
};

export default authenticate;