import express from "express";
import { register, login, getMe } from "../controllers/authController.js";
import { sendOtp, verifyOtp, resetPassword } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/otp/send", sendOtp);
router.post("/otp/verify", verifyOtp);
router.post("/reset", resetPassword);
export default router;
