import asyncHandler from "express-async-handler";
import Banner from "../models/Banner.js";

export const getActiveBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findOne({ isActive: true }).sort({ updatedAt: -1 });
  res.json({ banner });
});
export const getBanners = asyncHandler(async (req, res) => {
  res.json({ banners: await Banner.find().sort({ createdAt: -1 }) });
});
export const createBanner = asyncHandler(async (req, res) => {
  res.status(201).json({ banner: await Banner.create(req.body) });
});
export const updateBanner = asyncHandler(async (req, res) => {
  res.json({ banner: await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true }) });
});
export const deleteBanner = asyncHandler(async (req, res) => {
  await Banner.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});
export const getActiveBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
  res.json({ banners });
});