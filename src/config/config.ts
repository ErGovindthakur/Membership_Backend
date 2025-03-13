import { config } from "dotenv";
config();

const _config = {
     port:process.env.PORT
};

export const myConfig = Object.freeze(_config);