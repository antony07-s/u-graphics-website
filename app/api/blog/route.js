import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/blog -> list published posts.
// Logged-in admins/editors get ?all=1 to also see unpublished drafts.
export async function GET(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const wantsAll = searchParams.get("all") === "1";

  let query = { isPublished: true };
  if (wantsAll) {
    const session = await getServerSession(authOptions);
    if (session?.user && ["admin", "editor"].includes(session.user.role)) {
      query = {}; // admin sees everything, published or not
    }
  }

  const posts = await BlogPost.find(query).sort({
    publishedAt: -1,
    createdAt: -1,
  });
  return NextResponse.json({ posts });
}

// POST /api/blog -> create a new post (admin/editor only)
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["admin", "editor"].includes(session.user.role)) {
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