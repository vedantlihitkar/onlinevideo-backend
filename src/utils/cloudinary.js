// files aiygi or local path pe jaygi  

import { v2 as cloudinary } from 'cloudinary';

import fs from "fs" ;

// Configuration
cloudinary.config({ 
cloud_name: process.env.CLOUDINARY_CLOUD_NAME ,
api_key:  process.env.CLOUDINAR_API_KEY ,
api_secret: process.env.CLOUDINARY_API_SECRET

    
});
    

const uploadCloudinary = async function(localFilePath) {
// Upload an image

try {
    if (!localFilePath) return null 
    const uploadResult = await cloudinary.uploader.upload(localFilePath,{
        resource_type : "auto"
    });
   // console.log("file upload succesfully on cloudinary",uploadResult.url);
   fs.unlinkSync(localFilePath)
   

    return uploadResult ;
    
    
} catch (error) {
    fs.unlinkSync(localFilePath)
    return null ;
    
}

}

export {uploadCloudinary}