import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";

// GET /api/blog -> list published posts
export async function GET() {
  await connectDB();
  const posts = await BlogPost.find({ isPublished: true }).sort({
    publishedAt: -1,
  });
  return NextResponse.json({ posts });
}

// POST /api/blog -> create a new post (admin only)
export async function POST(request) {
  await connectDB();
  const body = await request.json();
  const post = await BlogPost.create(body);
  return NextResponse.json({ post }, { status: 201 });
}
