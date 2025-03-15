import mongoose from "mongoose";
import { myConfig } from "./config";

const connectDb = async () => {
  try {
    mongoose.connect(myConfig.dbUrl as string);

    // connection event handling
    mongoose.connection.on("connected", () => {
      console.log("Db connected");
    });

    mongoose.connection.on("error", () => {
      console.log("Error in connecting to database");
    });
  } catch (error) {
    console.error("Failed to connect db -: ", error);
    process.exit(1);
  }
};
export default connectDb;
