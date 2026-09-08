import dotenv from "dotenv";
dotenv.config({ path: ".env.local", quiet: true });

async function fix() {
  const { connectDB } = await import("../lib/mongodb.js");
  const { default: Product } = await import("../models/Product.js");
  await connectDB();

  const products = await Product.find({});
  for (const p of products) {
    const text = encodeURIComponent(p.title.replace(/ - .*/, ""));
    const url = `https://placehold.co/800x800/f1f5f9/64748b?text=${text}`;
    await Product.updateOne({ _id: p._id }, { $set: { image: url } });
    console.log(`Updated: ${p.title} -> ${url}`);
  }

  process.exit(0);
}

fix().catch((err) => { console.error(err); process.exit(1); });
