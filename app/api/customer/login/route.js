import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { customerCookie, makeCustomerToken } from "@/lib/customerAuth";
import { activeOtherSession, recordCustomerSession } from "@/lib/customerSessions";
const schema = z.object({ email: z.string().trim().email().max(254), password: z.string().min(1).max(128) });
export async function POST(request) { try { const { email, password } = schema.parse(await request.json()); await connectDB(); const customer = await Customer.findOne({ email: email.toLowerCase() }).select("+passwordHash emailVerifiedAt"); if (!customer || customer.emailVerifiedAt === null || !(await bcrypt.compare(password, customer.passwordHash))) return NextResponse.json({ error: "Invalid email or password." }, { status: 401 }); const sessionId = crypto.randomBytes(24).toString("base64url"); const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14); const otherSession = await activeOtherSession(customer.id); await recordCustomerSession(customer.id, sessionId, expiresAt, request.headers.get("user-agent")); const response = NextResponse.json({ customer: { id: customer.id, name: customer.name, email: customer.email }, otherSession }); response.cookies.set(customerCookie(makeCustomerToken(customer.id, sessionId))); return response; } catch { return NextResponse.json({ error: "Invalid email or password." }, { status: 400 }); } }
