import dotenv from "dotenv";
dotenv.config({ path: ".env.local", quiet: true });

async function check() {
  const { connectDB } = await import("../lib/mongodb.js");
  const { default: Category } = await import("../models/Category.js");
  const { default: Product } = await import("../models/Product.js");
  await connectDB();

  const categories = await Category.find({}).select("name slug").sort({ name: 1 }).lean();
  const products = await Product.find({}).populate("category", "name").select("title category").lean();

  const productsByCategory = new Map();
  products.forEach(p => {
    const catName = p.category?.name;
    if (!productsByCategory.has(catName)) productsByCategory.set(catName, []);
    productsByCategory.get(catName).push(p.title);
  });

  console.log(`Total categories: ${categories.length}\n`);
  categories.forEach((cat, i) => {
    const prods = productsByCategory.get(cat.name) || [];
    console.log(`${i + 1}. CATEGORY: "${cat.name}"`);
    if (prods.length === 0) {
      console.log(`   -> NO PRODUCT`);
    } else {
      prods.forEach(title => console.log(`   -> PRODUCT: "${title}"`));
    }
  });

  process.exit(0);
}

check().catch((err) => { console.error(err); process.exit(1); });
