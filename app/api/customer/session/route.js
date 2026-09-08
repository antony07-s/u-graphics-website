import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { clearCustomerCookie, readCustomerId } from "@/lib/customerAuth";
export async function GET() { const id = readCustomerId(); if (!id) return NextResponse.json({ customer: null }); await connectDB(); const customer = await Customer.findById(id).select("name email phone"); return NextResponse.json({ customer: customer ? { id: customer.id, name: customer.name, email: customer.email, phone: customer.phone } : null }); }
export async function DELETE() { const response = NextResponse.json({ ok: true }); response.cookies.set(clearCustomerCookie()); return response; }
