import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { customerCookie, makeCustomerToken } from "@/lib/customerAuth";
const schema = z.object({ name: z.string().trim().min(2).max(100), email: z.string().trim().email().max(254), phone: z.string().trim().max(30).optional(), password: z.string().min(8).max(128) });
export async function POST(request) { try { const input = schema.parse(await request.json()); await connectDB(); const email = input.email.toLowerCase(); if (await Customer.exists({ email })) return NextResponse.json({ error: "Unable to register with those details." }, { status: 409 }); const customer = await Customer.create({ name: input.name, email, phone: input.phone || "", passwordHash: await bcrypt.hash(input.password, 12) }); const response = NextResponse.json({ customer: { id: customer.id, name: customer.name, email: customer.email } }, { status: 201 }); response.cookies.set(customerCookie(makeCustomerToken(customer.id))); return response; } catch (error) { return NextResponse.json({ error: error instanceof z.ZodError ? "Please check the submitted details." : "Unable to register right now." }, { status: 400 }); } }
