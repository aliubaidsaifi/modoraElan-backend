import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

export const getStats = asyncHandler(async (req, res) => {
  const [revAgg, totalOrders, totalCustomers, totalProducts, recentOrders, statusAgg] = await Promise.all([
    Order.aggregate([
      { $match: { status: { $nin: ["cancelled", "refunded", "returned"] } } },
      { $group: { _id: null, revenue: { $sum: "$total" } } },
    ]),
    Order.countDocuments(),
    User.countDocuments({ role: "customer" }),
    Product.countDocuments(),
    Order.find().sort({ createdAt: -1 }).limit(5),
    Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
  ]);
  const statusCounts = {};
  statusAgg.forEach((s) => { statusCounts[s._id] = s.count; });
  res.json({
    revenue: revAgg[0]?.revenue || 0,
    totalOrders, totalCustomers, totalProducts, recentOrders, statusCounts,
  });
});