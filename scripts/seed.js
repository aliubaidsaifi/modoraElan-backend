import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Category from "../src/models/Category.js";
import Product from "../src/models/Product.js";
import User from "../src/models/User.js";
import { slugify } from "../src/utils/slugify.js";

// ===== EDIT: your 20 abayas (paste Cloudinary URLs after uploading) =====
const products = [
  {
    name: "Black Embroidered Abaya",
    description: "Flowing crepe abaya with delicate hand-embroidery.",
    price: 2499,
    compareAtPrice: 2999,
    images: ["https://res.cloudinary.com/REPLACE/abaya-1.jpg"],
    variants: [{ size: "S", stock: 5 }, { size: "M", stock: 5 }, { size: "L", stock: 5 }],
    isFeatured: true,
  },
  // ... add the other 19
];
// ========================================================================

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);

  // categories: Women > Abayas
  let women = await Category.findOne({ slug: "women" });
  if (!women) women = await Category.create({ name: "Women", slug: "women" });
  let abayas = await Category.findOne({ slug: "abayas" });
  if (!abayas)
    abayas = await Category.create({ name: "Abayas", slug: "abayas", parent: women._id });

  // admin user (change the password after first login!)
  const adminEmail = "admin@modora.com";
  if (!(await User.findOne({ email: adminEmail }))) {
    await User.create({
      name: "Admin", email: adminEmail, password: "changeme123", role: "admin",
    });
    console.log("Admin created:", adminEmail, "/ changeme123");
  }

  // products
  for (const p of products) {
    const slug = slugify(p.name);
    await Product.updateOne(
      { slug },
      { $set: { ...p, slug, category: abayas._id } },
      { upsert: true }
    );
    console.log("seeded:", p.name);
  }

  console.log("Done.");
  await mongoose.disconnect();
}

run().catch((e) => { console.error(e); process.exit(1); });
