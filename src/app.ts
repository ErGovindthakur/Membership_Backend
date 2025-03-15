import express from "express";
import createHttpError from 'http-errors';
 // Ensure this is correct

import { globalErrorHandler } from "./middleware/globalErrorHandler";


const app = express();

app.get("/", (req, res) => {
  const error = createHttpError(400,"Something went wrong");
  throw error;
});


// creating global error handler and it's a middleware (must be at last of all routes), it generally contains four parameter

app.use(globalErrorHandler)

export default app;