import dotenv from "dotenv";
dotenv.config({ path: ".env.local", quiet: true });

async function check() {
  const { connectDB } = await import("../lib/mongodb.js");
  const { default: Category } = await import("../models/Category.js");
  await connectDB();

  const signboards = await Category.countDocuments({ section: "signboards" });
  const digitalPrinting = await Category.countDocuments({ section: "digital-printing" });
  const general = await Category.countDocuments({ section: "general" });
  const missing = await Category.countDocuments({ section: { $exists: false } });
  const total = await Category.countDocuments({});

  console.log("Total categories:", total);
  console.log("signboards:", signboards);
  console.log("digital-printing:", digitalPrinting);
  console.log("general:", general);
  console.log("missing section field:", missing);

  process.exit(0);
}

check().catch((err) => { console.error(err); process.exit(1); });
