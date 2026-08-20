import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import { siteConfig } from "@/lib/siteConfig";
import { defaultEnquiryRecipient } from "@/lib/enquiryConfig";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const settings = await SiteSettings.findOne({ key: "primary" }).lean();
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "admin";
    const result = { ...(settings || siteConfig) };
    // The enquiry inbox is operational data, not public contact information.
    if (isAdmin) result.enquiryRecipientEmail ||= defaultEnquiryRecipient;
    else delete result.enquiryRecipientEmail;
    return NextResponse.json({ settings: result });
  } catch {
    return NextResponse.json({ settings: siteConfig });
  }
}

export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    const body = await request.json();
    const settings = await SiteSettings.findOneAndUpdate({ key: "primary" }, { ...body, key: "primary" }, { new: true, upsert: true, runValidators: true });
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ error: "Unable to update site settings." }, { status: 400 });
  }
}
