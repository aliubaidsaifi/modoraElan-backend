import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { slugify } from "../utils/slugify.js";

// GET /api/products?search=&category=&minPrice=&maxPrice=&size=&inStock=&sort=&featured=
export const getProducts = asyncHandler(async (req, res) => {
  const { category, featured, search, minPrice, maxPrice, size, inStock, sort } = req.query;
  const query = { isActive: true };

  if (category) {
    const cat = await Category.findOne({ slug: category });
    if (cat) {
      // category + uske subcategories ke products
      const subs = await Category.find({ parent: cat._id }).select("_id");
      query.category = { $in: [cat._id, ...subs.map((s) => s._id)] };
    }
  }
  if (featured === "true") query.isFeatured = true;
  if (search) query.name = { $regex: search, $options: "i" };
  if (size) query["variants.size"] = size;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  let q = Product.find(query).populate("category", "name slug");
  if (sort === "price_asc") q = q.sort({ price: 1 });
  else if (sort === "price_desc") q = q.sort({ price: -1 });
  else q = q.sort({ createdAt: -1 });

  let products = await q;
  if (inStock === "true") {
    products = products.filter((p) => p.variants.reduce((s, v) => s + (v.stock || 0), 0) > 0);
  }
  res.json({ products });
});

// GET /api/products/:slug
export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate("category", "name slug");
  if (!product) { res.status(404); throw new Error("Product not found"); }
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