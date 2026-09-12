import dotenv from "dotenv";
dotenv.config({ path: ".env.local", quiet: true });

async function check() {
  const { connectDB } = await import("../lib/mongodb.js");
  const { default: Product } = await import("../models/Product.js");
  const { default: Category } = await import("../models/Category.js");
  await connectDB();

  const totalProducts = await Product.countDocuments({});
  const totalCategories = await Category.countDocuments({});
  console.log("Total products:", totalProducts);
  console.log("Total categories:", totalCategories);

  const products = await Product.find({}).select("title slug").limit(100).lean();
  const categories = await Category.find({}).select("name slug").lean();
  const categoryNames = new Set(categories.map(c => c.name.toLowerCase()));

  const matchingCategoryNames = products.filter(p => categoryNames.has(p.title.toLowerCase()));
  console.log("Products whose title exactly matches a category name:", matchingCategoryNames.length);
  console.log("Examples:", matchingCategoryNames.slice(0, 5).map(p => p.title));

  process.exit(0);
}

check().catch((err) => { console.error(err); process.exit(1); });
