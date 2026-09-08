import dotenv from "dotenv";
dotenv.config({ path: ".env.local", quiet: true });

function makeSvgPlaceholder(text) {
  const safeText = text.replace(/[<>&]/g, "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800">
    <rect width="800" height="800" fill="#F1F5F9"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="36" fill="#64748B" text-anchor="middle" dominant-baseline="middle">${safeText}</text>
  </svg>`;
  const base64 = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}

async function fix() {
  const { connectDB } = await import("../lib/mongodb.js");
  const { default: Product } = await import("../models/Product.js");
  await connectDB();

  const products = await Product.find({});
  for (const p of products) {
    const shortTitle = p.title.replace(/ - .*/, "");
    const dataUrl = makeSvgPlaceholder(shortTitle);
    await Product.updateOne({ _id: p._id }, { $set: { image: dataUrl } });
    console.log(`Updated: ${p.title}`);
  }

  process.exit(0);
}

fix().catch((err) => { console.error(err); process.exit(1); });
