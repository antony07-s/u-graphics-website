import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";

export const dynamic = "force-dynamic";

// GET /api/categories -> list all categories (used for admin form dropdowns)
export async function GET() {
  await connectDB();
  const categories = await Category.find({}).sort({ order: 1, name: 1 });
  return NextResponse.json({ categories });
}
