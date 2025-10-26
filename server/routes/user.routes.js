// routes/user.routes.js
import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../controllers/user.controller.js";
import isAuth from "../middlewares/isAuth.js"

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Private routes
router.get("/profile", isAuth, getUserProfile);

export default router;
