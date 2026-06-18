import mongoose from "mongoose";
const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  codeHash: { type: String, required: true },
  purpose: { type: String, default: "login" }, // login | reset
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
}, { timestamps: true });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // auto-delete expired
export default mongoose.models.Otp || mongoose.model("Otp", otpSchema);