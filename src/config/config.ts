import { config } from "dotenv";
config();

const _config = {
     port:process.env.PORT,
     dbUrl:process.env.MONGO_URI,
     env:process.env.NODE_ENV
};

export const myConfig = Object.freeze(_config);