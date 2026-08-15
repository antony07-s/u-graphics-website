import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";

// GET /api/portfolio/:id -> single project (used to pre-fill the edit form)
export async function GET(request, { params }) {
  await connectDB();
  const project = await Project.findById(params.id).populate("category");
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ project });
}

// PUT /api/portfolio/:id -> update (admin only)
export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["admin", "editor"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const body = await request.json();

  const project = await Project.findByIdAndUpdate(params.id, body, {
    new: true,
    runValidators: true,
  });

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ project });
}

// DELETE /api/portfolio/:id -> delete (admin only)
export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["admin", "editor"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const project = await Project.findByIdAndDelete(params.id);

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
