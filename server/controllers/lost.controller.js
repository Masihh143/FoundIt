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
    const { itemName, description, location, dateLost } = req.body;
    if (!itemName || !description || !location || !dateLost) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let imageUrl = null;
    if (req.file && req.file.buffer) {
      const result = await uploadFile({
        file: req.file.buffer,
        folder: "lost_items",
      });
      imageUrl = result.secure_url;
    }

    const newItem = await Lost.create({
      itemName,
      description,
      location,
      dateLost,
      image: imageUrl,
      user: req.userId,
    });

    res.status(201).json(newItem);
  } catch (error) {
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
