import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";

async function authorize() {
  const session = await getServerSession(authOptions);
  return session?.user && ["admin", "editor"].includes(session.user.role);
}

export async function PUT(request, { params }) {
  if (!(await authorize())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    const service = await Service.findByIdAndUpdate(params.id, await request.json(), { new: true, runValidators: true });
    return service ? NextResponse.json({ service }) : NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch { return NextResponse.json({ error: "Unable to update service." }, { status: 400 }); }
}

export async function DELETE(_request, { params }) {
  if (!(await authorize())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const service = await Service.findByIdAndDelete(params.id);
  return service ? NextResponse.json({ success: true }) : NextResponse.json({ error: "Not found" }, { status: 404 });
}
