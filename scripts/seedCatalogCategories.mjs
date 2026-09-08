import dotenv from "dotenv";
import slugify from "slugify";
import { catalogCategories, sectionForCatalogCategory } from "../lib/catalogCategories.js";
import { categoryImageFallback } from "../lib/categoryImageFallbacks.js";

dotenv.config({ path: ".env.local", quiet: true });

async function seed() {
  const { connectDB } = await import("../lib/mongodb.js");
  const { default: Category } = await import("../models/Category.js");
  await connectDB();
  let created = 0;
  let updated = 0;
  let imagesAdded = 0;
  for (const [order, name] of catalogCategories.entries()) {
    const slug = slugify(name, { lower: true, strict: true });
    const existing = await Category.findOne({ slug }).select("_id section image");
    const section = sectionForCatalogCategory(name);
    const image = categoryImageFallback(name, section, order);
    if (!existing) { await Category.create({ name, slug, group: "signage", section, image, order: order + 100 }); created += 1; }
    else {
      const changes = {};
      if (existing.section !== section) changes.section = section;
      if (!existing.image) { changes.image = image; imagesAdded += 1; }
      if (Object.keys(changes).length) { await Category.updateOne({ _id: existing._id }, { $set: changes }); updated += 1; }
    }
  }
  // Existing category from the original site that is not part of the supplied seed list.
  await Category.updateOne({ slug: "3d-led-signage" }, { $set: { section: "signboards" } });
  const existingLed = await Category.findOne({ slug: "3d-led-signage" }).select("image");
  if (existingLed && !existingLed.image) {
    await Category.updateOne({ _id: existingLed._id }, { $set: { image: categoryImageFallback("3D LED Signage", "signboards") } });
    imagesAdded += 1;
  }
  console.log(`Catalogue category seed complete: ${created} created, ${updated} categories updated, ${imagesAdded} images added.`);
  process.exit(0);
}
seed().catch((error) => { console.error("Unable to seed catalogue categories.", error.message); process.exit(1); });
