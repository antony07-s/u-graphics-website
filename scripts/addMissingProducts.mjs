import dotenv from "dotenv";
dotenv.config({ path: ".env.local", quiet: true });

async function seed() {
  const { connectDB } = await import("../lib/mongodb.js");
  const { default: Product } = await import("../models/Product.js");
  const { default: Category } = await import("../models/Category.js");
  await connectDB();

  const missing = ["Acrylic Product", "Gold Acrylic Mirror"];

  for (const name of missing) {
    const category = await Category.findOne({ name }).select("_id slug section name");
    if (!category) { console.log(`Category not found: ${name}`); continue; }

    const existing = await Product.findOne({ category: category._id });
    if (existing) { console.log(`Already has a product: ${name}`); continue; }

    const price = category.section === "digital-printing" ? 250 : 1500;

    await Product.create({
      title: category.name,
      slug: `${category.slug}-standard`,
      category: category._id,
      shortDescription: `Custom ${category.name.toLowerCase()} by U Graphics.`,
      description: `U Graphics provides custom ${category.name.toLowerCase()} solutions with practical material guidance, careful production and a finish aligned to your brand. Contact us for exact sizing, artwork, and quantity requirements.`,
      image: "",
      gallery: [],
      variants: [],
      priceTiers: [{ minQuantity: 1, price }],
      minimumOrderQuantity: 1,
      stock: 50,
      isFeatured: false,
      isBestseller: false,
    });

    console.log(`Created product for: ${name}`);
  }

  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
