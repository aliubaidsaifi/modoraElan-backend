import express from "express";
import { getActiveBanner, getActiveBanners, getBanners, createBanner, updateBanner, deleteBanner } from "../controllers/bannerController.js";
import { protect, adminOnly } from "../middleware/auth.js";
const router = express.Router();
router.get("/active", getActiveBanners);                    // public — carousel
router.get("/hero", getActiveBanner);                       // public — single (kept)
router.get("/", protect, adminOnly, getBanners);
router.post("/", protect, adminOnly, createBanner);
router.patch("/:id", protect, adminOnly, updateBanner);
router.delete("/:id", protect, adminOnly, deleteBanner);
export default router;