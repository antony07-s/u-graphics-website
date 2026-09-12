import { NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
const schema = z.object({ id: z.string().refine(mongoose.isValidObjectId), isApproved: z.boolean() });
async function authorized() { const session = await getServerSession(authOptions); return session?.user && ["admin", "editor"].includes(session.user.role); }
export async function GET() { if (!(await authorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); try { await connectDB(); const reviews = await Review.find({}).populate("product", "title slug").sort({ createdAt: -1 }).limit(100).lean(); return NextResponse.json({ reviews }); } catch { return NextResponse.json({ error: "Unable to load reviews." }, { status: 500 }); } }
export async function PATCH(request) { if (!(await authorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); try { const input = schema.parse(await request.json()); await connectDB(); const review = await Review.findByIdAndUpdate(input.id, { $set: { isApproved: input.isApproved } }, { new: true }); return review ? NextResponse.json({ review }) : NextResponse.json({ error: "Review not found." }, { status: 404 }); } catch { return NextResponse.json({ error: "Unable to update review." }, { status: 400 }); } }
export async function DELETE(request) { if (!(await authorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); try { const id = new URL(request.url).searchParams.get("id"); if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: "Invalid review." }, { status: 400 }); await connectDB(); const result = await Review.deleteOne({ _id: id }); return result.deletedCount ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Review not found." }, { status: 404 }); } catch { return NextResponse.json({ error: "Unable to delete review." }, { status: 500 }); } }
