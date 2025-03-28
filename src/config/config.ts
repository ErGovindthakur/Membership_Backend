import { config } from "dotenv";

config();

const _config = {
     port:process.env.PORT,
     dbUrl:process.env.MONGO_URI,
     env:process.env.NODE_ENV,
     jwtSecret:process.env.JWT_SECRET,
     cloudinaryCloud:process.env.CLOUDINARY_CLOUD,
     cloudinaryApiKey:process.env.CLOUDINARY_API_KEY,
     cloudinarySecret:process.env.CLOUDINARY_SECRET,
     fontEndDomain:process.env.FRONTEND_DOMAIN,
};

export const myConfig = Object.freeze(_config);