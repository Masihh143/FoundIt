import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";

// Routes
import userRoutes from "./routes/user.routes.js";
import lostRoutes from "./routes/lost.routes.js";
import foundRoutes from "./routes/found.routes.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json({ limit: "10mb" })); // Parse JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS setup (adjust origin for your frontend)
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/lost", lostRoutes);
app.use("/api/found", foundRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("✅ FoundIt API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
