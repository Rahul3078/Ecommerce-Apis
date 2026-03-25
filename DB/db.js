import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()
export const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGODB_URL);
        console.log("mongodb connetct successufll")

    } catch (error) {
        console.log("mongodb connection failed")
        process.exit(1)
    }
}