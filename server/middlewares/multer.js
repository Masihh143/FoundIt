// middleware/multer.js
import multer from "multer";
import path from "path";

// ✅ Use memory storage so we get file buffers (no saving to disk)
const storage = multer.memoryStorage();

// ✅ Optional: Validate file type & size
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|heic|heif/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);

  if (ext && mime) cb(null, true);
  else cb(new Error("Only image files are allowed (jpeg, jpg, png, webp, heic)"));
};

// ✅ Export multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
