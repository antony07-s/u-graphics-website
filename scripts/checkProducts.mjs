import dotenv from "dotenv";
dotenv.config({ path: ".env.local", quiet: true });

async function check() {
  const { connectDB } = await import("../lib/mongodb.js");
  const { default: Product } = await import("../models/Product.js");
  await connectDB();
  const total = await Product.countDocuments({});
  console.log("Total products in database:", total);
  const sample = await Product.find({}).limit(3);
  console.log(JSON.stringify(sample, null, 2));
  process.exit(0);
}

check().catch((err) => { console.error(err); process.exit(1); });
