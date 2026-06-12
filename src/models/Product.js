import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  { size: { type: String, required: true }, stock: { type: Number, default: 0 } },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number, default: 0 },
    images: [{ type: String }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    variants: [variantSchema],
    tags: [{ type: String }],
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

productSchema.virtual("inStock").get(function () {
  return this.variants.reduce((s, v) => s + v.stock, 0) > 0;
});

export default mongoose.model("Product", productSchema);
