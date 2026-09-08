import { signboards, digitalPrinting } from "./serviceCatalog.js";

const pools = {
  signboards: signboards.filter((item) => item.image),
  "digital-printing": digitalPrinting.filter((item) => item.image),
  general: signboards.filter((item) => item.image),
};

// Temporary display image only. A Category.image (Cloudinary) always wins.
//
// Matching priority:
// 1. Exact slug match (most accurate - e.g. "3d-led-signboard" category
//    gets the image specifically chosen for that exact item)
// 2. Fallback: assign by order, so even unmatched categories still get
//    a distinct image instead of all repeating the same one
export function categoryImageFallback(name, section, order = 0, slug) {
  const pool = pools[section] || pools.general;
  if (!pool.length) return "";

  if (slug) {
    const exactMatch = pool.find((item) => item.slug === slug);
    if (exactMatch) return exactMatch.image;
  }

  return pool[order % pool.length]?.image || "";
}
