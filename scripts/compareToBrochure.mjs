import dotenv from "dotenv";
dotenv.config({ path: ".env.local", quiet: true });

async function check() {
  const { connectDB } = await import("../lib/mongodb.js");
  const { default: Product } = await import("../models/Product.js");
  const { catalogCategories } = await import("../lib/catalogCategories.js");
  await connectDB();

  const products = await Product.find({}).select("title").lean();

  const titleCounts = {};
  products.forEach(p => { titleCounts[p.title] = (titleCounts[p.title] || 0) + 1; });

  console.log("=== DUPLICATE product titles (appearing more than once) ===");
  const duplicates = Object.entries(titleCounts).filter(([, count]) => count > 1);
  if (duplicates.length === 0) console.log("None found.");
  duplicates.forEach(([title, count]) => console.log(`"${title}" appears ${count} times`));

  const productTitles = new Set(products.map(p => p.title));
  const catalogLower = new Map(catalogCategories.map(name => [name.toLowerCase(), name]));

  console.log("\n=== Catalog categories NOT found as an exact product title (typos/mismatches) ===");
  let mismatchCount = 0;
  catalogCategories.forEach(name => {
    if (!productTitles.has(name)) {
      const looseMatch = [...productTitles].find(t => t.toLowerCase() === name.toLowerCase());
      mismatchCount++;
      console.log(looseMatch ? `MISMATCH: "${looseMatch}" should be "${name}"` : `MISSING: "${name}" has no product at all`);
    }
  });
  if (mismatchCount === 0) console.log("None found — all catalog categories have a matching product title.");

  console.log("\n=== Product titles that don't match ANY catalog category (expected: your 8 real named products) ===");
  products.forEach(p => {
    if (!catalogLower.has(p.title.toLowerCase())) {
      console.log(`"${p.title}"`);
    }
  });

  process.exit(0);
}

check().catch((err) => { console.error(err); process.exit(1); });
