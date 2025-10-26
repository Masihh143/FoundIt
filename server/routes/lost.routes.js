// routes/lost.routes.js
import express from "express";
import {
  createLostItem,
  getAllLostItems,
  getLostItemById,
} from "../controllers/lost.controller.js";
import { upload } from "../middleware/multer.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

// Public route
router.get("/", getAllLostItems);
router.get("/:id", getLostItemById);

// Protected (requires login)
router.post("/add", isAuth, upload.single("image"), createLostItem);

export default router;
