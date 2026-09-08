import dotenv from "dotenv";
dotenv.config({ path: ".env.local", quiet: true });

async function check() {
  const { connectDB } = await import("../lib/mongodb.js");
  const { default: Product } = await import("../models/Product.js");
  await import("../models/Category.js");
  await connectDB();
  const all = await Product.find({}).populate("category", "name slug section").select("title slug category isFeatured isBestseller");
  all.forEach(p => console.log(`${p.title} | category: ${p.category?.name} (${p.category?.section}) | slug: ${p.slug}`));
  console.log("\nTotal:", all.length);
  process.exit(0);
}

check().catch((err) => { console.error(err); process.exit(1); });
