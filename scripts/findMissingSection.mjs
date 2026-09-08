import dotenv from "dotenv";
dotenv.config({ path: ".env.local", quiet: true });

async function check() {
  const { connectDB } = await import("../lib/mongodb.js");
  const { default: Category } = await import("../models/Category.js");
  await connectDB();

  const docs = await Category.find({
    $or: [
      { section: { $exists: false } },
      { name: /acrylic product/i },
      { name: /gold acrylic mirror/i }
    ]
  }).select("name slug section");

  console.log(JSON.stringify(docs, null, 2));

  process.exit(0);
}

check().catch((err) => { console.error(err); process.exit(1); });
