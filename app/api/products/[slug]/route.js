import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { parseProductInput } from "@/lib/productValidation";
export async function GET(_request, { params }) { await connectDB(); const product = await Product.findOne({ slug: params.slug }).populate("category", "name slug description").lean(); return product ? NextResponse.json({ product }) : NextResponse.json({ error: "Product not found." }, { status: 404 }); }


async function authorize() {
  const { getServerSession } = await import("next-auth");
  const { authOptions } = await import("@/lib/auth");
  const session = await getServerSession(authOptions);
  return session?.user && ["admin", "editor"].includes(session.user.role);
}

export async function PUT(request, { params }) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const body = parseProductInput(await request.json());
    if (!(await Category.exists({ _id: body.category }))) return NextResponse.json({ error: "Category not found." }, { status: 400 });
    const product = await Product.findOneAndUpdate(
      { slug: params.slug },
      body,
      { new: true, runValidators: true }
    );
    return product
      ? NextResponse.json({ product })
      : NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to update product. Check the submitted fields." },
      { status: 400 }
    );
  }
}

export async function DELETE(_request, { params }) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const product = await Product.findOneAndDelete({ slug: params.slug });
  return product
    ? NextResponse.json({ success: true })
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}
