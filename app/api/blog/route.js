import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const body = await request.json();
  try {
    const post = await BlogPost.create(body);
    return NextResponse.json({ post }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to create post. Check the submitted fields." }, { status: 400 });
  }
}
