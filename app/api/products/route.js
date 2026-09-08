import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
const integer = (value, fallback, max) => { const n = Number(value); return Number.isInteger(n) && n > 0 ? Math.min(n, max) : fallback; };
export async function GET(request) { try { await connectDB(); const params = new URL(request.url).searchParams; const limit = integer(params.get("limit"), 12, 40); const page = integer(params.get("page"), 1, 10000); const query = {}; const search = params.get("q")?.trim(); const categorySlug = params.get("category")?.trim(); if (search) { if (search.length > 80) return NextResponse.json({ error: "Search query is too long." }, { status: 400 }); query.$or = [{ title: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } }, { slug: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } }]; }
  if (categorySlug) { const category = await Category.findOne({ slug: categorySlug }).select("_id"); if (!category) return NextResponse.json({ products: [], page, total: 0 }); query.category = category._id; }
  if (params.get("featured") === "true") query.isFeatured = true; if (params.get("bestseller") === "true") query.isBestseller = true; if (params.get("subcategory")) query.subcategory = params.get("subcategory").trim();
  const [products, total] = await Promise.all([Product.find(query).populate("category", "name slug").sort({ isFeatured: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(), Product.countDocuments(query)]); return NextResponse.json({ products, page, limit, total, hasMore: page * limit < total });
} catch { return NextResponse.json({ error: "Unable to load products." }, { status: 500 }); } }
