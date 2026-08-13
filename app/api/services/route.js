import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";

// GET /api/services  -> list all services (optionally filter by ?category=slug)
export async function GET(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get("category");

  const query = {};
  if (categorySlug) {
    const Category = (await import("@/models/Category")).default;
    const category = await Category.findOne({ slug: categorySlug });
    if (category) query.category = category._id;
  }

  const services = await Service.find(query)
    .populate("category")
    .sort({ order: 1, createdAt: -1 });

  return NextResponse.json({ services });
}

// POST /api/services -> create a new service (admin only — auth check to be added)
export async function POST(request) {
  await connectDB();
  const body = await request.json();

  const service = await Service.create(body);
  return NextResponse.json({ service }, { status: 201 });
}
