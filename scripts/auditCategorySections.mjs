import dotenv from "dotenv";
dotenv.config({ path: ".env.local", quiet: true });

async function check() {
  const { connectDB } = await import("../lib/mongodb.js");
  const { default: Category } = await import("../models/Category.js");
  await connectDB();

  const missingDocs = await Category.find({ section: { $exists: false } }).select("name slug section");
  console.log("Documents missing section field:");
  console.log(JSON.stringify(missingDocs, null, 2));

  const all = await Category.find({}).select("name slug section").sort({ name: 1 });
  console.log("\nAll categories and their sections:");
  all.forEach(c => console.log(`${c.section ?? "MISSING"}  |  ${c.name}`));

  process.exit(0);
}

check().catch((err) => { console.error(err); process.exit(1); });
