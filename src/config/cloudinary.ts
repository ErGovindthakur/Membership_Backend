import { v2 as cloudinary } from 'cloudinary';
import { myConfig } from './config';

// Configuration
cloudinary.config({ 
     cloud_name: myConfig.cloudinaryCloud, 
     api_key: myConfig.cloudinaryApiKey, 
     api_secret: myConfig.cloudinarySecret
 });

 export default cloudinary