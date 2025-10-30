import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import { configureCloudinary } from "./config/cloudinary.js";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import userRoutes from "./routes/user.routes.js";
import lostRoutes from "./routes/lost.routes.js";
import foundRoutes from "./routes/found.routes.js";
import claimRoutes from "./routes/claims.routes.js";

dotenv.config();

// Test environment variables
console.log("=== Environment Variables Test ===");
console.log("CLOUD_NAME:", process.env.CLOUD_NAME);
console.log("CLOUD_API_KEY:", process.env.CLOUD_API_KEY);
console.log("CLOUD_API_SECRET:", process.env.CLOUD_API_SECRET);
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "SET" : "NOT SET");
console.log("dbUrl:", process.env.dbUrl ? "SET" : "NOT SET");
console.log("==================================");

// Configure Cloudinary after environment variables are loaded
configureCloudinary();

connectDB();

const app = express();

// Middleware
app.use(express.json({ limit: "10mb" })); // Parse JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS: allow same-origin in production; use CLIENT_URL in dev
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (process.env.NODE_ENV === "production") return cb(null, true);
      return cb(null, origin === process.env.CLIENT_URL);
    },
    credentials: true,
  })
);

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/lost", lostRoutes);
app.use("/api/found", foundRoutes);
app.use("/api/claims", claimRoutes);

// Serve frontend in production
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDistPath = path.resolve(__dirname, "../client/FoundIt/dist");

app.use(express.static(clientDistPath));

// Health check and SPA fallback
app.get("/", (req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});

// SPA fallback for any non-API route (Express 5-compatible)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
