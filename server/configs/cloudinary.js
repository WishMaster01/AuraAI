import { v2 as cloudinary } from "cloudinary";
import { Readable } from "node:stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (fileBuffer, originalName = "upload.jpg") => {
  if (!fileBuffer) {
    throw new Error("Missing file buffer");
  }

  const safeName = String(originalName || "upload.jpg")
    .trim()
    .replace(/\s+/g, "_");

  try {
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "auraai",
          public_id: `${Date.now()}-${safeName}`,
          resource_type: "image",
        },
        (error, result) => {
          if (error) return reject(error);
          return resolve(result);
        }
      );

      Readable.from([fileBuffer]).pipe(stream);
    });

    return uploadResult.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("ERROR DURING CLOUDINARY UPLOADING");
  }
};

export default uploadOnCloudinary;
