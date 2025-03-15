import express from "express";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import userRouter from "./user/userRouter";


const app = express();

// Essential middlewares 
app.use(express.json());

// routes as middleware
app.use("/api/users",userRouter);


// creating global error handler and it's a middleware (must be at last of all routes), it generally contains four parameter
app.use(globalErrorHandler)

export default app;