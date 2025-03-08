import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';



// Cloudinary Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET
});



const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        // upload File on cloudinary
        const reponse = await cloudinary.uploader.upload(
            localFilePath,
            { resource_type: "auto" }
        );
        console.log("File uploaded on Cloudinary: ", reponse);
        
        //once the file is uploaded we would like to delete it from our server
        fs.unlinkSync(localFilePath);
        return reponse

    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null
    };
};


export { uploadOnCloudinary }