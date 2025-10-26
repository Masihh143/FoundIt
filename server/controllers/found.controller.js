// controllers/found.controller.js
import { uploadFile } from "../config/cloudinary.js";
import Found from "../models/foundModel.js";

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
      const result = await uploadFile({
        file: req.file.buffer,
        folder: "found_items",
      });
      imageUrl = result.secure_url;
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
    const items = await Found.find().populate("user", "username email");
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
    const item = await Found.findById(req.params.id).populate("user", "username email");
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
