import mongoose from "mongoose";
export const objectId = (value) => typeof value === "string" && mongoose.isValidObjectId(value);
export function priceFor(product, quantity) { const eligible = (product.priceTiers || []).filter((tier) => quantity >= tier.minQuantity).sort((a, b) => b.minQuantity - a.minQuantity); return eligible[0]?.price ?? null; }
export function validVariants(product, selected = []) {
  const variants = product.variants || [];
  if (!Array.isArray(selected) || selected.length !== variants.length) return false;

  // Each configurable option must be supplied once.  Checking only that
  // submitted pairs exist allowed a caller to omit an option or send the
  // same option repeatedly.
  const names = new Set(selected.map((item) => item?.name));
  return names.size === selected.length && selected.every(
    (item) => typeof item?.name === "string"
      && typeof item?.value === "string"
      && variants.some((variant) => variant.name === item.name && variant.value === item.value)
  );
}
export function safeProduct(product) { return product; }
