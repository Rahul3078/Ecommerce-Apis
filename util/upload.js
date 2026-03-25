import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

// multer config
const storage = multer.diskStorage({});
const upload = multer({ storage });

// ✅ DYNAMIC SINGLE
export const uploadSingle = (fieldName) => {
    return upload.single(fieldName);
};

// ✅ DYNAMIC MULTIPLE
export const uploadMultiple = (fieldName, count = 5) => {
    return upload.array(fieldName, count);
};

// cloudinary upload
export const uploadToCloudinary = async (filePath) => {
    return await cloudinary.uploader.upload(filePath);
};

// delete function
export const deleteFromCloudinary = async (public_id) => {
    return await cloudinary.uploader.destroy(public_id);
};