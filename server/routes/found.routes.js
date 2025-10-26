// routes/found.routes.js
import express from "express";
import {
  createFoundItem,
  getAllFoundItems,
  getFoundItemById,
} from "../controllers/found.controller.js";
import { upload } from "../middlewares/multer.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

// Public route
router.get("/", getAllFoundItems);
router.get("/:id", getFoundItemById);

// Protected (requires login)
router.post("/add", isAuth, upload.single("image"), createFoundItem);

export default router;
