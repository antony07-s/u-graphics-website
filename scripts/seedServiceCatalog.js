/**
 * Run this ONCE to copy every hardcoded Signboards + Digital Printing item
 * from lib/serviceCatalog.js into MongoDB as real Service documents.
 *
 * Why: the site works fine without this (the catalog file is the fallback),
 * but having real documents lets you edit each one — swap in a real photo,
 * write a proper description — through /admin/services instead of code.
 *
 * Safe to re-run: any slug that already exists in MongoDB is skipped, never
 * overwritten, so it won't undo edits you've already made in the admin panel.
 *
 * Usage:  node scripts/seedServiceCatalog.js
 */
require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI not found — check your .env.local file.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const ServiceSchema = new mongoose.Schema(
    {
      title: String,
      slug: { type: String, unique: true },
      catalogGroup: String,
      shortDescription: String,
      description: String,
      image: String,
      order: { type: Number, default: 0 },
    },
    { timestamps: true }
  );
  const Service =
    mongoose.models.Service || mongoose.model("Service", ServiceSchema);

  // lib/serviceCatalog.js uses ES module `export` syntax, which plain
  // require() can't read — dynamic import() handles it correctly instead.
  // Keep this in sync with that file if its item lists ever change.
  const { signboards, digitalPrinting } = await import(
    "../lib/serviceCatalog.js"
  );

  const allItems = [
    ...signboards.map((item) => ({ ...item, catalogGroup: "signboards" })),
    ...digitalPrinting.map((item) => ({
      ...item,
      catalogGroup: "digital-printing",
    })),
  ];

  let created = 0;
  let skipped = 0;

  for (let i = 0; i < allItems.length; i++) {
    const item = allItems[i];
    const existing = await Service.findOne({ slug: item.slug });
    if (existing) {
      skipped++;
      continue;
    }
    await Service.create({
      title: item.title,
      slug: item.slug,
      catalogGroup: item.catalogGroup,
      image: item.image,
      order: i,
    });
    created++;
  }

  console.log(`✅ Done. Created ${created} new service(s), skipped ${skipped} already in MongoDB.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});