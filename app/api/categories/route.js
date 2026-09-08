import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";

export const dynamic = "force-dynamic";

// GET /api/categories?section=signboards&page=1&limit=10
// With no parameters this remains the full list used by existing admin forms.
export async function GET(request) {
  try {
    await connectDB();
    const params = new URL(request.url).searchParams;
    const section = params.get("section");
    const pageValue = Number(params.get("page"));
    const limitValue = Number(params.get("limit"));
    const page = Number.isInteger(pageValue) && pageValue > 0 ? Math.min(pageValue, 10000) : 1;
    const limit = Number.isInteger(limitValue) && limitValue > 0 ? Math.min(limitValue, 40) : 100;
    const query = ["signboards", "digital-printing", "general"].includes(section) ? { section } : {};
    const [categories, total] = await Promise.all([
      Category.find(query).sort({ order: 1, name: 1 }).skip((page - 1) * limit).limit(limit),
      Category.countDocuments(query),
    ]);
    return NextResponse.json({ categories, page, limit, total, hasMore: page * limit < total });
  } catch {
    return NextResponse.json({ error: "Unable to load categories." }, { status: 500 });
  }
}
