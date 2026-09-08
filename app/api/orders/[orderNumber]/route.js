import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { readCustomerId } from "@/lib/customerAuth";
import Order from "@/models/Order";
export async function GET(_request, { params }) { const customer = readCustomerId(); if (!customer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); await connectDB(); const order = await Order.findOne({ customer, orderNumber: params.orderNumber }).lean(); return order ? NextResponse.json({ order }) : NextResponse.json({ error: "Order not found." }, { status: 404 }); }
