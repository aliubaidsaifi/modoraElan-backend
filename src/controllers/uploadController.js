import asyncHandler from "express-async-handler";
import cloudinary from "../config/cloudinary.js";

// POST /api/upload  (multipart, field "image")  (admin)
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No image provided");
  }
  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "modora/products" }, (err, r) =>
        err ? reject(err) : resolve(r)
      )
      .end(req.file.buffer);
  });
  res.json({ url: result.secure_url, publicId: result.public_id });
});
