import { NextResponse } from "next/server";
import { POST as requestOtp } from "@/app/api/customer/otp/request/route";

export async function POST(request) {
  try {
    const body = await request.json();
    return requestOtp(new Request(request.url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, purpose: "register" }) }));
  } catch { return Response.json({ error: "Please check the submitted details." }, { status: 400 }); }
}
