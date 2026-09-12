import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { v2 as cloudinary } from "cloudinary";
import { authOptions } from "@/lib/auth";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["admin", "editor"].includes(session.user.role)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { paramsToSign } = await request.json();
    const folder = paramsToSign?.folder;
    if (typeof folder !== "string" || !/^ugraphics\/[a-z0-9/_-]{1,100}$/i.test(folder)) return NextResponse.json({ error: "Invalid upload folder." }, { status: 400 });
    if (!process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_CLOUD_NAME) return NextResponse.json({ error: "Media uploads are not configured." }, { status: 503 });
    const now = Math.floor(Date.now() / 1000);
    if (!Number.isInteger(paramsToSign?.timestamp) || paramsToSign.timestamp < now - 300 || paramsToSign.timestamp > now + 60) return NextResponse.json({ error: "Invalid upload request." }, { status: 400 });
    const allowedParams = { folder, timestamp: paramsToSign.timestamp };
    const signature = cloudinary.utils.api_sign_request(allowedParams, process.env.CLOUDINARY_API_SECRET);
    return NextResponse.json({ signature });
  } catch { return NextResponse.json({ error: "Unable to authorize upload." }, { status: 400 }); }
}
