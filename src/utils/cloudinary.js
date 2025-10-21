import {v2 as cloudinary} from "cloudinary"
import fs from "fs" //installed already, use to read write open the files

cloudinary.config({ 
  cloud_name: process.env.CLODINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async(localFilePath)=>{
    try {
        if(!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        //the file has een uploaded successfully
        console.log("File is uploaded on cloudinary",
            response.url)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath) //it removes the locally saved temporary file as the operation got failed
        return null
    }
}

export {uploadOnCloudinary}