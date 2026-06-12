import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { slugify } from "../utils/slugify.js";

// GET /api/products?category=abayas&featured=true&search=black
export const getProducts = asyncHandler(async (req, res) => {
  const { category, featured, search } = req.query;
  const query = { isActive: true };

  if (category) {
    const cat = await Category.findOne({ slug: category });
    if (cat) {
      // include this category AND its direct sub-categories
      const children = await Category.find({ parent: cat._id }).select("_id");
      const ids = [cat._id, ...children.map((c) => c._id)];
      query.category = { $in: ids };
    }
  }
  if (featured === "true") query.isFeatured = true;
  if (search) query.name = { $regex: search, $options: "i" };

  const products = await Product.find(query)
    .populate("category", "name slug")
    .sort({ createdAt: -1 });
  res.json({ products });
});
// GET /api/products/:slug
export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate(
    "category",
    "name slug"
  );
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json({ product });
});

// POST /api/products  (admin)
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({ ...req.body, slug: slugify(req.body.name) });
  res.status(201).json({ product });
});

// PATCH /api/products/:id  (admin)
export const updateProduct = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (data.name) data.slug = slugify(data.name);
  const product = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
  res.json({ product });
});

// DELETE /api/products/:id  (admin)
export const deleteProduct = asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});
