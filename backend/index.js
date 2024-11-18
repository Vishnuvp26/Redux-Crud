import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from 'mongoose';
import cors from "cors";
import userRoutes from "./routes/userRouter.js";
import adminRoutes from './routes/adminRouter.js'

dotenv.config();

const app = express()
const PORT = process.env.PORT

const mongoDB_URI = process.env.MONGO_URI;

mongoose.connect(mongoDB_URI)
.then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
    console.log('Server running');
});