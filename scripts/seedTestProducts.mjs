import dotenv from "dotenv";
dotenv.config({ path: ".env.local", quiet: true });

async function seed() {
  const { connectDB } = await import("../lib/mongodb.js");
  const { default: Product } = await import("../models/Product.js");
  const { default: Category } = await import("../models/Category.js");
  await connectDB();

  const testProducts = [
    { categorySlug: "3d-led-signage", title: "3D LED Signage - Storefront Package", shortDescription: "Illuminated 3D LED letters for storefront branding.", price: 4500, stock: 10, isFeatured: true },
    { categorySlug: "acrylic-panel-signage", title: "Acrylic Panel Signage - Standard", shortDescription: "Sleek acrylic panel signage for indoor or outdoor use.", price: 1200, stock: 25 },
    { categorySlug: "pylon-signage", title: "Pylon Signage - Roadside", shortDescription: "Tall pylon sign for high visibility roadside branding.", price: 8500, stock: 5, isBestseller: true },
    { categorySlug: "directory-signage", title: "Directory Signage Board", shortDescription: "Wayfinding directory board for buildings and malls.", price: 950, stock: 15 },
    { categorySlug: "uv-flatbed-direct-printing", title: "UV Flatbed Direct Printing - Panel", shortDescription: "High-resolution UV printing on rigid panels.", price: 350, stock: 50, isFeatured: true },
    { categorySlug: "sticker", title: "Custom Cut Sticker - Pack of 50", shortDescription: "Die-cut vinyl stickers, custom shapes and sizes.", price: 120, stock: 100 },
    { categorySlug: "vehicle-wrapping", title: "Vehicle Wrapping - Full Wrap", shortDescription: "Full vehicle wrap with custom design and print.", price: 15000, stock: 3, isBestseller: true },
    { categorySlug: "roll-up-bunting-stand", title: "Roll Up Banner Stand", shortDescription: "Portable roll-up banner stand for events.", price: 450, stock: 30 },
  ];

  let created = 0, skipped = 0;

  for (const p of testProducts) {
    const category = await Category.findOne({ slug: p.categorySlug }).select("_id");
    if (!category) { console.log(`Skipped (category not found): ${p.categorySlug}`); skipped += 1; continue; }

    const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const existing = await Product.findOne({ slug });
    if (existing) { console.log(`Skipped (already exists): ${p.title}`); skipped += 1; continue; }

    await Product.create({
      title: p.title,
      slug,
      category: category._id,
      shortDescription: p.shortDescription,
      description: p.shortDescription,
      image: "/images/placeholder-product.jpg",
      priceTiers: [{ minQuantity: 1, price: p.price }],
      stock: p.stock,
      isFeatured: p.isFeatured || false,
      isBestseller: p.isBestseller || false,
    });
    console.log(`Created: ${p.title}`);
    created += 1;
  }

  console.log(`\nDone. Created: ${created}, Skipped: ${skipped}`);
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
