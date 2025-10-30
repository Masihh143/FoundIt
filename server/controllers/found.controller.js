// controllers/found.controller.js
import { uploadFile } from "../config/cloudinary.js";
import Found from "../models/foundModel.js";
import Lost from "../models/lostModel.js";
import Claim from "../models/claimModel.js";

/**
 * @desc Create a new found item
 * @route POST /api/found/add
 * @access Private
 */
export const createFoundItem = async (req, res) => {
  try {
    const { itemName, description, location, dateFound } = req.body;
    if (!itemName || !description || !location || !dateFound) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let imageUrl = null;
    if (req.file && req.file.buffer) {
      console.log("Processing image upload...");
      
      // Check if Cloudinary is configured
      if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
        console.log("Cloudinary not configured, skipping image upload");
        // Continue without image upload
      } else {
        try {
          const result = await uploadFile({
            file: req.file.buffer,
            folder: "found_items",
          });
          imageUrl = result.secure_url;
          console.log("Image uploaded successfully:", imageUrl);
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          return res.status(500).json({ message: "Image upload failed" });
        }
      }
    }

    const newItem = await Found.create({
      itemName,
      description,
      location,
      dateFound,
      image: imageUrl,
      user: req.userId,
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get all found items
 * @route GET /api/found
 */
export const getAllFoundItems = async (req, res) => {
  try {
    const items = await Found.find().populate("user", "name email");
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get found item by ID
 * @route GET /api/found/:id
 */
export const getFoundItemById = async (req, res) => {
  try {
    const item = await Found.findById(req.params.id).populate("user", "name email");
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Create a claim for a found item by linking to user's lost item
 * @route POST /api/found/:id/claim
 * @access Private
 */
export const claimFoundItem = async (req, res) => {
  try {
    const foundId = req.params.id;
    const { lostId } = req.body;

    const foundItem = await Found.findById(foundId);
    if (!foundItem) return res.status(404).json({ message: "Found item not found" });

    const lostItem = await Lost.findById(lostId);
    if (!lostItem) return res.status(404).json({ message: "Lost item not found" });

    if (lostItem.user.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only claim with your own lost items" });
    }

    // Create claim
    const claim = await Claim.create({
      found: foundItem._id,
      lost: lostItem._id,
      claimerUser: req.userId,
      founderUser: foundItem.user,
      status: "pending",
    });

    res.status(201).json({ message: "Claim created", claim });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
