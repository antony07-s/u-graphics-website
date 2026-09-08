import dotenv from "dotenv";
dotenv.config({ path: ".env.local", quiet: true });

async function check() {
  const { connectDB } = await import("../lib/mongodb.js");
  const { default: Cart } = await import("../models/Cart.js");
  await connectDB();
  const total = await Cart.countDocuments({});
  console.log("Total cart documents:", total);
  const all = await Cart.find({}).lean();
  console.log(JSON.stringify(all, null, 2));
  process.exit(0);
}

check().catch((err) => { console.error(err); process.exit(1); });
