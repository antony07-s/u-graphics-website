import { signboards, digitalPrinting } from "./serviceCatalog.js";

const pools = {
  signboards: signboards.filter((item) => item.image),
  "digital-printing": digitalPrinting.filter((item) => item.image),
  general: signboards.filter((item) => item.image),
};

// Temporary display image only. A Category.image (Cloudinary) always wins.
export function categoryImageFallback(name, section, order = 0) {
  const pool = pools[section] || pools.general;
  const words = name.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 3);
  const matched = pool.find((item) => words.some((word) => item.title.toLowerCase().includes(word)));
  return matched?.image || pool[order % pool.length]?.image || "";
}
