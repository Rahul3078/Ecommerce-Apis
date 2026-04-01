import express from 'express';
import { connectDB } from './DB/db.js';
import userRoutes from "./routes/userRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import dotenv from 'dotenv';
import cors from "cors"

dotenv.config()

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


await connectDB()

app.use(cors())
app.get("/", (req, res) => {
    res.send("API is running")
})

app.use("/api/user", userRoutes)
app.use("/api/admin", adminRoutes)


let PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`Server is running on :${PORT}`)
})












