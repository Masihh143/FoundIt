// config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";

// ✅ Configure once globally using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

/**
 * Upload a file buffer or base64 string directly to Cloudinary.
 * @param {Object} options
 *  - file: Buffer | base64 string | URL | local path
 *  - folder: optional Cloudinary folder name
 *  - resource_type: "image" by default, can be "auto" for any file
 * @returns {Promise<Object>} - Cloudinary upload result (contains secure_url, public_id, etc.)
 */
export const uploadFile = async ({ file, folder = "foundit", resource_type = "image" }) => {
  try {
    if (Buffer.isBuffer(file)) {
      // For in-memory buffers (from multer.memoryStorage)
      return await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder, resource_type },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(file);
      });
    }

    // For URLs, base64 strings, or local paths
    const result = await cloudinary.uploader.upload(file, { folder, resource_type });
    return result;
  } catch (err) {
    throw new Error(`Cloudinary upload failed: ${err.message}`);
  }
};

export default cloudinary;
