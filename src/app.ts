import express from "express";
import cors from "cors";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import userRouter from "./user/userRouter";
import bookRouter from "./Book/bookRouter";
import { myConfig } from "./config/config";


const app = express();

// Allowing cors policy
app.use(cors({
     origin:myConfig.fontEndDomain,
     credentials:true
}));

// Essential middlewares 
app.use(express.json());

// routes as middleware
app.use("/api/users",userRouter);
app.use("/api/books",bookRouter);


// creating global error handler and it's a middleware (must be at last of all routes), it generally contains four parameter
app.use(globalErrorHandler)

export default app;