import dotenv from "dotenv";
dotenv.config({ path: ".env.local", quiet: true });

async function fix() {
  const { connectDB } = await import("../lib/mongodb.js");
  const { default: Product } = await import("../models/Product.js");
  await connectDB();

  const mapping = {
    "3d-led-signage-storefront-package": "/images/products/3d-led-signage-storefront-package.jpg",
    "acrylic-panel-signage-standard": "/images/products/acrylic-panel-signage-standard.jpg",
    "pylon-signage-roadside": "/images/products/pylon-signage-roadside.jpg",
    "directory-signage-board": "/images/products/directory-signage-board.jpg",
    "uv-flatbed-direct-printing-panel": "/images/products/uv-flatbed-direct-printing-panel.jpg",
    "custom-cut-sticker-pack-of-50": "/images/products/custom-cut-sticker-pack-of-50.jpg",
    "vehicle-wrapping-full-wrap": "/images/products/vehicle-wrapping-full-wrap.jpg",
    "roll-up-banner-stand": "/images/products/roll-up-banner-stand.jpg",
  };

  for (const [slug, image] of Object.entries(mapping)) {
    const result = await Product.updateOne({ slug }, { $set: { image } });
    console.log(`${slug}: matched ${result.matchedCount}, modified ${result.modifiedCount}`);
  }

  process.exit(0);
}

fix().catch((err) => { console.error(err); process.exit(1); });
