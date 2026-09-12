import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
const statuses = ["placed", "processing", "shipped", "delivered", "cancelled"];
const schema = z.object({ orderNumber: z.string().trim().max(80), orderStatus: z.enum(statuses) });
async function authorized() { const session = await getServerSession(authOptions); return session?.user && ["admin", "editor"].includes(session.user.role); }
export async function GET(request) { if (!(await authorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); try { await connectDB(); const q = new URL(request.url).searchParams.get("q")?.trim().slice(0, 80); const query = q ? { $or: [{ orderNumber: { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } }, { "customerInformation.email": { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } }] } : {}; const orders = await Order.find(query).sort({ createdAt: -1 }).limit(100).lean(); return NextResponse.json({ orders }); } catch { return NextResponse.json({ error: "Unable to load orders." }, { status: 500 }); } }
export async function PATCH(request) { if (!(await authorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); try { const input = schema.parse(await request.json()); await connectDB(); const order = await Order.findOneAndUpdate({ orderNumber: input.orderNumber }, { $set: { orderStatus: input.orderStatus } }, { new: true }); return order ? NextResponse.json({ order }) : NextResponse.json({ error: "Order not found." }, { status: 404 }); } catch { return NextResponse.json({ error: "Unable to update order." }, { status: 400 }); } }
