import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const getAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ addresses: user.addresses || [] });
});

export const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const addr = req.body;
  if (addr.isDefault || user.addresses.length === 0) {
    user.addresses.forEach((a) => (a.isDefault = false));
    addr.isDefault = true;
  }
  user.addresses.push(addr);
  await user.save();
  res.status(201).json({ addresses: user.addresses });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.id);
  if (user.addresses.length && !user.addresses.some((a) => a.isDefault)) {
    user.addresses[0].isDefault = true;
  }
  await user.save();
  res.json({ addresses: user.addresses });
});

export const setDefaultAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses.forEach((a) => (a.isDefault = a._id.toString() === req.params.id));
  await user.save();
  res.json({ addresses: user.addresses });
});

export const getCustomers = asyncHandler(async (req, res) => {
  const customers = await User.aggregate([
    { $match: { role: "customer" } },
    { $lookup: { from: "orders", localField: "_id", foreignField: "user", as: "orders" } },
    { $project: {
        name: 1, email: 1, phone: 1, createdAt: 1,
        orderCount: { $size: "$orders" },
        totalSpent: { $sum: "$orders.total" },
    } },
    { $sort: { createdAt: -1 } },
  ]);
  res.json({ customers });
});