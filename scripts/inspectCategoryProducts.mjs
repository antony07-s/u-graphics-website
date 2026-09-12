import dotenv from "dotenv";
dotenv.config({ path: ".env.local", quiet: true });

async function check() {
  const { connectDB } = await import("../lib/mongodb.js");
  const { default: Product } = await import("../models/Product.js");
  const { default: Category } = await import("../models/Category.js");
  await connectDB();

  const categories = await Category.find({}).select("name").lean();
  const categoryNames = new Set(categories.map(c => c.name.toLowerCase()));

  const products = await Product.find({}).select("title image priceTiers createdAt").lean();
  const categoryLike = products.filter(p => categoryNames.has(p.title.toLowerCase()));

  console.log("Sample of the 69 category-named products:\n");
  categoryLike.slice(0, 10).forEach(p => {
    console.log(`Title: ${p.title}`);
    console.log(`Image: ${p.image || "(none)"}`);
    console.log(`Price: ${p.priceTiers?.[0]?.price}`);
    console.log(`Created: ${p.createdAt}`);
    console.log("---");
  });

  process.exit(0);
}

check().catch((err) => { console.error(err); process.exit(1); });
