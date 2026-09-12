/**
 * scripts/seed-products.js
 *
 * One-time bulk script: creates one starter Product for every existing
 * Category (signboards + digital-printing), using the catalog data already
 * in lib/serviceCatalog.js for the title/image/description, and a rough
 * placeholder price you MUST review and correct in the admin panel
 * afterwards (real pricing isn't known yet).
 *
 * Safe to re-run: skips any category that already has a product.
 *
 * Usage: node scripts/seed-products.js
 */
require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

const CategorySchema = new mongoose.Schema({}, { strict: false });
const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema, "categories");

const ProductSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema, "products");

// Rough starting price placeholder by section — EDIT these defaults in the
// admin panel once you know your real pricing.
const DEFAULT_PRICE = {
  signboards: 1500,
  "digital-printing": 250,
};

(async () => {
  await mongoose.connect(MONGODB_URI);

  const categories = await Category.find({
    section: { $in: ["signboards", "digital-printing"] },
  }).lean();

  console.log(`Found ${categories.length} categories.`);

  let created = 0;
  let skipped = 0;

  for (const category of categories) {
    const productSlug = `${category.slug}-standard`;

    const existing = await Product.findOne({ category: category._id });
    if (existing) {
      skipped++;
      continue;
    }

    await Product.create({
      title: category.name,
      slug: productSlug,
      category: category._id,
      subcategory: "",
      shortDescription: category.description || `Custom ${category.name.toLowerCase()} by U Graphics.`,
      description: `U Graphics provides custom ${category.name.toLowerCase()} solutions with practical material guidance, careful production and a finish aligned to your brand. Contact us for exact sizing, artwork, and quantity requirements.`,
      image: category.image || "",
      gallery: [],
      variants: [],
      priceTiers: [
        { minQuantity: 1, price: DEFAULT_PRICE[category.section] || 500 },
      ],
      minimumOrderQuantity: 1,
      stock: 50,
      isFeatured: false,
      isBestseller: false,
    });

    created++;
    console.log(`Created product for: ${category.name}`);
  }

  console.log(`\nDone. Created ${created} products, skipped ${skipped} (already had a product).`);
  console.log("IMPORTANT: All prices are PLACEHOLDER defaults (₹1500 for signboards, ₹250 for printing).");
  console.log("Go to /admin/products and update each one with your real pricing, images, and descriptions.");
  process.exit(0);
})();
