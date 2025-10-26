// config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";

// Function to configure Cloudinary (called after dotenv loads)
export const configureCloudinary = () => {
  console.log("Cloudinary configuration:");
  console.log("CLOUD_NAME:", process.env.CLOUD_NAME);
  console.log("CLOUD_API_KEY:", process.env.CLOUD_API_KEY);
  console.log("CLOUD_API_SECRET:", process.env.CLOUD_API_SECRET);

  // Check if all required variables are present
  if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
    console.error("❌ Missing Cloudinary environment variables!");
    console.error("Required: CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET");
    return false;
  } else {
    console.log("✅ All Cloudinary environment variables are set");
    
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
      secure: true,
    });
    return true;
  }
};

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
    console.log("uploadFile called with:", { folder, resource_type });
    console.log("File type:", typeof file);
    console.log("Is Buffer:", Buffer.isBuffer(file));
    
    if (Buffer.isBuffer(file)) {
      console.log("Processing buffer upload...");
      // For in-memory buffers (from multer.memoryStorage)
      return await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder, resource_type },
          (error, result) => {
            if (error) {
              console.error("Cloudinary stream error:", error);
              return reject(error);
            }
            console.log("Cloudinary upload successful:", result);
            resolve(result);
          }
        );
        stream.end(file);
      });
    }

    console.log("Processing direct upload...");
    // For URLs, base64 strings, or local paths
    const result = await cloudinary.uploader.upload(file, { folder, resource_type });
    console.log("Direct upload successful:", result);
    return result;
  } catch (err) {
    console.error("uploadFile error:", err);
    throw new Error(`Cloudinary upload failed: ${err.message}`);
  }
};

export default cloudinary;
