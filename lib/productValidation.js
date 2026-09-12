import { z } from "zod";
import mongoose from "mongoose";

const url = z.string().trim().max(2000).refine((value) => value.startsWith("/") || /^https:\/\//.test(value), "Invalid image URL");
const tier = z.object({ minQuantity: z.number().int().min(1).max(1000000), price: z.number().min(0).max(100000000) });
const variant = z.object({ name: z.string().trim().min(1).max(80), value: z.string().trim().min(1).max(120) });
export const productInputSchema = z.object({
  title: z.string().trim().min(2).max(180), slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(180), category: z.string().refine(mongoose.isValidObjectId, "Invalid category"), subcategory: z.string().trim().max(80).optional().default(""), shortDescription: z.string().trim().max(350).optional().default(""), description: z.string().trim().max(10000).optional().default(""), image: url.optional().or(z.literal("")).default(""), gallery: z.array(url).max(12).default([]), variants: z.array(variant).max(20).default([]), priceTiers: z.array(tier).min(1).max(20), minimumOrderQuantity: z.number().int().min(1).max(1000000).default(1), stock: z.number().int().min(0).max(10000000).default(0), isFeatured: z.boolean().default(false), isBestseller: z.boolean().default(false),
}).superRefine((input, ctx) => { if (input.priceTiers.some((item) => item.minQuantity < input.minimumOrderQuantity)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Price tiers must meet the minimum order quantity." }); });
export function parseProductInput(value) { const input = productInputSchema.parse(value); return { ...input, gallery: [...new Set(input.gallery)], priceTiers: [...input.priceTiers].sort((a, b) => a.minQuantity - b.minQuantity) }; }
