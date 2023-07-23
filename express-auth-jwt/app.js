import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;
const DATABASE_URL = process.env.DATABASE_URL;

// CORS policy
app.use(cors());

// Database connection
connectDB(DATABASE_URL);

// JSON
app.use(express.json());

// Load Routes
app.use("/api/user", userRoutes);

app.listen(PORT, () => {
    console.log(`Server listening on port: http://localhost:${PORT}`);
});
