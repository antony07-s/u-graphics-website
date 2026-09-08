import dotenv from "dotenv";
dotenv.config({ path: ".env.local", quiet: true });

async function fix() {
  const { connectDB } = await import("../lib/mongodb.js");
  const { default: Product } = await import("../models/Product.js");
  await connectDB();
  const result = await Product.updateMany(
    { image: "/images/placeholder-product.jpg" },
    { $set: { image: "/images/ugraphics.png" } }
  );
  console.log("Updated:", result.modifiedCount);
  process.exit(0);
}

fix().catch((err) => { console.error(err); process.exit(1); });
