import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String, price: Number, size: String,
    quantity: { type: Number, default: 1 }, image: String,
    measurements: { type: Object, default: null },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled", "returned", "refunded"],
      default: "pending",
    },
    shippingAddress: {
      fullName: String, phone: String, line1: String,
      city: String, state: String, pincode: String,
    },
    paymentMethod: { type: String, default: "COD" },
    paymentId: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);