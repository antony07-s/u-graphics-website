require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

if (!PEXELS_API_KEY) {
  console.error("Missing PEXELS_API_KEY in .env.local.");
  process.exit(1);
}

async function fetchImage(query) {
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
    { headers: { Authorization: PEXELS_API_KEY } }
  );
  const data = await res.json();
  return data?.photos?.[0]?.src?.large || null;
}

(async () => {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  const categories = await db.collection("categories").find({}).toArray();
  const categoryMap = {};
  for (const cat of categories) {
    categoryMap[cat._id.toString()] = cat;
  }

  const products = await db
    .collection("products")
    .find({ $or: [{ image: "" }, { image: null }, { image: { $exists: false } }] })
    .toArray();

  console.log(`Found ${products.length} products with no image.`);

  let updated = 0;
  let failed = 0;

  for (const product of products) {
    const category = categoryMap[product.category?.toString()];
    const hint = category?.section === "digital-printing" ? "print" : "signage";
    const query = `${product.title} ${hint}`;

    const imageUrl = await fetchImage(query);

    if (imageUrl) {
      // Direct update command - bypasses Mongoose document change-tracking
      // entirely, which is what silently failed to save last time.
      await db.collection("products").updateOne(
        { _id: product._id },
        { $set: { image: imageUrl } }
      );
      updated++;
      console.log(`Updated: ${product.title}`);
    } else {
      failed++;
      console.log(`No result for: ${product.title}`);
    }

    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`\nDone. Updated ${updated} products, ${failed} had no match found.`);
  process.exit(0);
})();
