// controllers/lost.controller.js
import { uploadFile } from "../config/cloudinary.js";
import Lost from "../models/lostModel.js";

/**
 * @desc Create a new lost item
 * @route POST /api/lost/add
 * @access Private
 */
export const createLostItem = async (req, res) => {
  try {
    console.log("=== Lost Item Creation Debug ===");
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);
    console.log("User ID:", req.userId);
    
    const { itemName, description, location, dateLost } = req.body;
    if (!itemName || !description || !location || !dateLost) {
      console.log("Missing required fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    let imageUrl = null;
    if (req.file && req.file.buffer) {
      console.log("Processing image upload...");
      console.log("Cloudinary config check:");
      console.log("CLOUD_NAME:", process.env.CLOUD_NAME ? "SET" : "NOT SET");
      console.log("CLOUD_API_KEY:", process.env.CLOUD_API_KEY ? "SET" : "NOT SET");
      console.log("CLOUD_API_SECRET:", process.env.CLOUD_API_SECRET ? "SET" : "NOT SET");
      
      // Check if Cloudinary is configured
      if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
        console.log("Cloudinary not configured, skipping image upload");
        // Continue without image upload
      } else {
        try {
          console.log("Attempting Cloudinary upload...");
          const result = await uploadFile({
            file: req.file.buffer,
            folder: "lost_items",
          });
          imageUrl = result.secure_url;
          console.log("Image uploaded successfully:", imageUrl);
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          console.error("Upload error details:", uploadError.message);
          return res.status(500).json({ message: "Image upload failed: " + uploadError.message });
        }
      }
    }

    console.log("Creating lost item in database...");
    const newItem = await Lost.create({
      itemName,
      description,
      location,
      dateLost,
      image: imageUrl,
      user: req.userId,
    });

    console.log("Lost item created successfully:", newItem._id);
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error creating lost item:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get all lost items
 * @route GET /api/lost
 */
export const getAllLostItems = async (req, res) => {
  try {
    const items = await Lost.find().populate("user", "name email");
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get lost item by ID
 * @route GET /api/lost/:id
 */
export const getLostItemById = async (req, res) => {
  try {
    const item = await Lost.findById(req.params.id).populate("user", "name email");
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
