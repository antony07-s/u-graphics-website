import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import EmailOtp from "@/models/EmailOtp";
import { sendCustomerOtp } from "@/lib/email";

const registerSchema = z.object({ purpose: z.literal("register"), name: z.string().trim().min(2).max(100), email: z.string().trim().email().max(254), phone: z.string().trim().max(30).optional(), password: z.string().min(8).max(128) });
const resetSchema = z.object({ purpose: z.literal("reset"), email: z.string().trim().email().max(254) });
const schema = z.discriminatedUnion("purpose", [registerSchema, resetSchema]);
const generic = { message: "If the email can be used, a verification code has been sent." };

export async function POST(request) {
  try {
    const input = schema.parse(await request.json());
    const email = input.email.toLowerCase();
    await connectDB();
    const customer = await Customer.findOne({ email }).select("_id");
    if ((input.purpose === "register" && customer) || (input.purpose === "reset" && !customer)) return NextResponse.json(generic);
    const existing = await EmailOtp.findOne({ email, purpose: input.purpose }).select("lastSentAt");
    if (existing && Date.now() - existing.lastSentAt.getTime() < 60_000) return NextResponse.json({ error: "Please wait before requesting another code." }, { status: 429 });
    const code = crypto.randomInt(100000, 1000000).toString();
    const update = { codeHash: await bcrypt.hash(code, 12), expiresAt: new Date(Date.now() + 10 * 60_000), attempts: 0, lastSentAt: new Date() };
    if (input.purpose === "register") Object.assign(update, { name: input.name, phone: input.phone || "", passwordHash: await bcrypt.hash(input.password, 12) });
    await EmailOtp.findOneAndUpdate({ email, purpose: input.purpose }, { $set: update }, { upsert: true, new: true, setDefaultsOnInsert: true });
    await sendCustomerOtp({ email, code, purpose: input.purpose });
    return NextResponse.json(generic);
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Please check the submitted details." }, { status: 400 });
    return NextResponse.json({ error: "We could not send a verification code. Please try again later." }, { status: 503 });
  }
}

