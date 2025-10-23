import {v2 as cloudinary} from "cloudinary"
import fs from "fs" //installed already, use to read write open the files

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        
        //the file has been uploaded successfully
        console.log("File is uploaded on cloudinary. URL: ", response.url);
        
        // After successful upload, unlink the local file
        fs.unlinkSync(localFilePath); 
        return response;

    } catch (error) {
        console.error("Cloudinary upload failed:", error); 

        fs.unlinkSync(localFilePath); 
        return null;
    }
}

export {uploadOnCloudinary}
