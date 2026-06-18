import mongoose from "mongoose";
const bannerSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  image: String,                 // Cloudinary URL
  ctaText: { type: String, default: "Shop Now" },
  ctaLink: { type: String, default: "/search" },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });
export default mongoose.models.Banner || mongoose.model("Banner", bannerSchema);