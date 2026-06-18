import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";

// POST /api/orders  (optionalAuth — logged-in ho to user link hoga)
export const createOrder = asyncHandler(async (req, res) => {
  const { items, total, shippingAddress, paymentMethod } = req.body;
  if (!items || items.length === 0) { res.status(400); throw new Error("Cart is empty"); }
  const order = await Order.create({
    user: req.user?._id || null,
    items, total, shippingAddress,
    paymentMethod: paymentMethod || "COD",
    status: "pending",
  });
  res.status(201).json({ order });
});

// GET /api/orders/my  (logged-in customer ke apne orders)
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ orders });
});

// GET /api/orders  (admin — saare orders)
export const getOrders = asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  const query = {};
  if (status && status !== "all") query.status = status;
  if (search) {
    query.$or = [
      { "shippingAddress.fullName": { $regex: search, $options: "i" } },
      { "shippingAddress.phone": { $regex: search, $options: "i" } },
    ];
  }
  const orders = await Order.find(query).sort({ createdAt: -1 });
  res.json({ orders });
});

// PATCH /api/orders/:id  (admin)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json({ order });
});