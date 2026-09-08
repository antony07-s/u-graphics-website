import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { readCustomerId } from "@/lib/customerAuth";
import Order from "@/models/Order";
export async function GET(request) { const customer = readCustomerId(); if (!customer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); await connectDB(); const page = Math.max(1, Math.min(10000, Number(new URL(request.url).searchParams.get("page")) || 1)); const limit = Math.max(1, Math.min(25, Number(new URL(request.url).searchParams.get("limit")) || 12)); const [orders, total] = await Promise.all([Order.find({ customer }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(), Order.countDocuments({ customer })]); return NextResponse.json({ orders, total, page, hasMore: page * limit < total }); }
