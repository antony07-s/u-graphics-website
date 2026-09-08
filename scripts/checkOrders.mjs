import dotenv from "dotenv";
dotenv.config({ path: ".env.local", quiet: true });

async function check() {
  const { connectDB } = await import("../lib/mongodb.js");
  const { default: Order } = await import("../models/Order.js");
  await connectDB();
  const total = await Order.countDocuments({});
  console.log("Total orders:", total);
  const sample = await Order.find({}).limit(3).lean();
  console.log(JSON.stringify(sample, null, 2));
  process.exit(0);
}

check().catch((err) => { console.error(err); process.exit(1); });
