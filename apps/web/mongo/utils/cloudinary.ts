
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function uploadImageToCloudinary(imageFile: File): Promise<any> {
    const buffer = Buffer.from(await imageFile.arrayBuffer());

    const cloudinaryResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        }).end(buffer); 
    });

    
    return cloudinaryResponse;
}

export default cloudinary;