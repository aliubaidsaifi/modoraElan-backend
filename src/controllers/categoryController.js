import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";
import { slugify } from "../utils/slugify.js";

// GET /api/categories
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ order: 1 });
  res.json({ categories });
});

// POST /api/categories  (admin)
export const createCategory = asyncHandler(async (req, res) => {
  const { name, parent, image } = req.body;
  const category = await Category.create({
    name,
    slug: slugify(name),
    parent: parent || null,
    image: image || "",
  });
  res.status(201).json({ category });
});

// PATCH /api/categories/:id  (admin)
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ category });
});

// DELETE /api/categories/:id  (admin)
export const deleteCategory = asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});
