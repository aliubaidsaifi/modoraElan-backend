import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const addressSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  line1: String,
  city: String,
  state: String,
  pincode: String,
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      select: false,
      minlength: 6, 
      select: false
    },

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    phone: {
      type: String,
      default: "",
    },

    addresses: [addressSchema], // ✅ yahan hona chahiye
  },
  {
    timestamps: true,
  }
);

// Hash password before save
userSchema.pre("save", async function (next) {
if (!this.password || !this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);