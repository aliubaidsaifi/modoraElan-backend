import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import { sendEmail } from "../utils/sendEmail.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role });
const hashCode = (code) => crypto.createHash("sha256").update(String(code)).digest("hex");

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) { res.status(400); throw new Error("Email already registered"); }
  const user = await User.create({ name, email, password });
  res.status(201).json({ user: publicUser(user), token: signToken(user._id) });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !user.password || !(await user.matchPassword(password))) {
    res.status(401); throw new Error("Invalid credentials");
  }
  res.json({ user: publicUser(user), token: signToken(user._id) });
});

// GET /api/auth/me  (protected)
export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

// POST /api/auth/otp/send  { email, purpose }
export const sendOtp = asyncHandler(async (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();
  const purpose = req.body.purpose === "reset" ? "reset" : "login";
  if (!/^\S+@\S+\.\S+$/.test(email)) { res.status(400); throw new Error("Valid email is required"); }
  if (purpose === "reset" && !(await User.findOne({ email }))) {
    res.status(404); throw new Error("No account with this email");
  }
  const code = String(Math.floor(100000 + Math.random() * 900000));
  await Otp.deleteMany({ email, purpose });
  await Otp.create({ email, purpose, codeHash: hashCode(code), expiresAt: new Date(Date.now() + 5 * 60 * 1000) });
  await sendEmail(email, "Your Modora Élan code",
    `<p>Your verification code is <b style="font-size:22px;letter-spacing:4px">${code}</b></p><p>Expires in 5 minutes.</p>`);
  res.json({ success: true });
});

// POST /api/auth/otp/verify  { email, code }
export const verifyOtp = asyncHandler(async (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();
  const code = (req.body.code || "").trim();
  const record = await Otp.findOne({ email, purpose: "login" }).sort({ createdAt: -1 });
  if (!record) { res.status(400); throw new Error("OTP expired. Please request again."); }
  if (record.attempts >= 5) { await record.deleteOne(); res.status(429); throw new Error("Too many attempts. Request a new OTP."); }
  if (record.codeHash !== hashCode(code)) {
    record.attempts++; await record.save();
    res.status(400); throw new Error("Incorrect OTP");
  }
  await record.deleteOne();
  let user = await User.findOne({ email });
  let isNew = false;
  if (!user) { user = await User.create({ email, name: email.split("@")[0], role: "customer" }); isNew = true; }
  res.json({ user: publicUser(user), token: signToken(user._id), isNew });
});

// POST /api/auth/reset  { email, code, password }
export const resetPassword = asyncHandler(async (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();
  const code = (req.body.code || "").trim();
  const password = req.body.password || "";
  if (password.length < 6) { res.status(400); throw new Error("Password must be at least 6 characters"); }
  const record = await Otp.findOne({ email, purpose: "reset" }).sort({ createdAt: -1 });
  if (!record || record.codeHash !== hashCode(code)) { res.status(400); throw new Error("Invalid or expired OTP"); }
  await record.deleteOne();
  const user = await User.findOne({ email });
  if (!user) { res.status(404); throw new Error("Account not found"); }
  user.password = password; // pre-save hook hashes
  await user.save();
  res.json({ user: publicUser(user), token: signToken(user._id) });
});