import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";

const EMAIL = process.env.ADMIN_EMAIL || "aliubaidsaifi@gmail.com";
const PASSWORD = process.env.ADMIN_PASSWORD || "Welcome@12345";

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  // is email ka account dhundo (customer ho ya admin)
  let user = await User.findOne({ email: EMAIL });

  if (user) {
    user.role = "admin";
    user.password = PASSWORD;   // pre-save hook hash karega
    await user.save();
    console.log("✅ Existing account ab admin hai:", EMAIL);
  } else {
    user = new User({ name: "Admin", email: EMAIL, password: PASSWORD, role: "admin" });
    await user.save();
    console.log("✅ Naya admin bana:", EMAIL);
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((e) => { console.error(e); process.exit(1); });