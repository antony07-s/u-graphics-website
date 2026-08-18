import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";

async function authorize() {
  const session = await getServerSession(authOptions);
  return session?.user && ["admin", "editor"].includes(session.user.role);
}

// PUT /api/enquiry/:id -> update status (new / contacted / closed)
export async function PUT(request, { params }) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const { status } = await request.json();
  if (!["new", "contacted", "closed"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  const enquiry = await Enquiry.findByIdAndUpdate(
    params.id,
    { status },
    { new: true }
  );
  if (!enquiry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ enquiry });
}

// DELETE /api/enquiry/:id -> remove an enquiry
export async function DELETE(request, { params }) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const enquiry = await Enquiry.findByIdAndDelete(params.id);
  if (!enquiry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}