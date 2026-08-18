import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";

async function authorize() {
  const session = await getServerSession(authOptions);
  return session?.user && ["admin", "editor"].includes(session.user.role);
}

// GET /api/blog/:id -> single post, any status (used to pre-fill the admin edit form)
export async function GET(request, { params }) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const post = await BlogPost.findById(params.id);
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ post });
}

// PUT /api/blog/:id -> update
export async function PUT(request, { params }) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  try {
    const post = await BlogPost.findByIdAndUpdate(params.id, await request.json(), {
      new: true,
      runValidators: true,
    });
    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ post });
  } catch {
    return NextResponse.json(
      { error: "Unable to update post. Check the submitted fields." },
      { status: 400 }
    );
  }
}

// DELETE /api/blog/:id -> delete
export async function DELETE(request, { params }) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const post = await BlogPost.findByIdAndDelete(params.id);
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}