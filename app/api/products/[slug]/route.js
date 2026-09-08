import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
export async function GET(_request, { params }) { await connectDB(); const product = await Product.findOne({ slug: params.slug }).populate("category", "name slug description").lean(); return product ? NextResponse.json({ product }) : NextResponse.json({ error: "Product not found." }, { status: 404 }); }
