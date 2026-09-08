import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { readCustomerId } from "@/lib/customerAuth";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { objectId, priceFor } from "@/lib/commerce";
const schema = z.object({ quantity: z.number().int().positive().max(100000) });
export async function PATCH(request, { params }) { const customer = readCustomerId(); if (!customer || !objectId(params.itemId)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); try { const { quantity } = schema.parse(await request.json()); await connectDB(); const cart = await Cart.findOne({ customer }); const item = cart?.items.id(params.itemId); if (!item) return NextResponse.json({ error: "Cart item not found." }, { status: 404 }); const product = await Product.findById(item.product); if (!product || quantity > product.stock || quantity < product.minimumOrderQuantity) return NextResponse.json({ error: "Quantity is unavailable." }, { status: 400 }); const price = priceFor(product, quantity); if (price === null) return NextResponse.json({ error: "No applicable price tier." }, { status: 400 }); item.quantity = quantity; item.priceAtAddTime = price; await cart.save(); return NextResponse.json({ ok: true }); } catch { return NextResponse.json({ error: "Invalid quantity." }, { status: 400 }); } }
export async function DELETE(_request, { params }) { const customer = readCustomerId(); if (!customer || !objectId(params.itemId)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); await connectDB(); const result = await Cart.updateOne({ customer }, { $pull: { items: { _id: params.itemId } } }); return result.matchedCount ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Cart not found." }, { status: 404 }); }
