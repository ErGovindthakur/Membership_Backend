import { Request, Response, NextFunction } from "express";


const createBook = (req: Request, res: Response, next: NextFunction) => {
     const {} = req.body;
     // when data comes through forms
     
     res.json({message:"ok"})
};

export { createBook };
