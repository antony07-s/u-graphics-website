import mongoose from "mongoose";
export const objectId = (value) => typeof value === "string" && mongoose.isValidObjectId(value);
export function priceFor(product, quantity) { const eligible = (product.priceTiers || []).filter((tier) => quantity >= tier.minQuantity).sort((a, b) => b.minQuantity - a.minQuantity); return eligible[0]?.price ?? null; }
export function validVariants(product, selected = []) { if (!Array.isArray(selected) || selected.length > (product.variants || []).length) return false; return selected.every((item) => typeof item?.name === "string" && typeof item?.value === "string" && product.variants.some((variant) => variant.name === item.name && variant.value === item.value)); }
export function safeProduct(product) { return product; }
