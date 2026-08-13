import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import Category from "@/models/Category";

// GET /api/portfolio?category=slug -> list projects, optionally filtered
export async function GET(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get("category");

  const query = {};
  if (categorySlug) {
    const category = await Category.findOne({ slug: categorySlug });
    if (category) query.category = category._id;
  }

  const projects = await Project.find(query)
    .populate("category")
    .sort({ createdAt: -1 });

  return NextResponse.json({ projects });
}

// POST /api/portfolio -> create a new project (admin only)
export async function POST(request) {
  await connectDB();
  const body = await request.json();

  const project = await Project.create(body);
  return NextResponse.json({ project }, { status: 201 });
}
