import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { signboards, digitalPrinting } from "@/lib/serviceCatalog";

// GET /api/services  -> list all services (optionally filter by ?category=slug)
export async function GET(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get("category");
  const catalogGroup = searchParams.get("catalogGroup");
  const includeCatalogDefaults = searchParams.get("includeCatalogDefaults") === "true";

  const query = {};
  if (categorySlug) {
    const Category = (await import("@/models/Category")).default;
    const category = await Category.findOne({ slug: categorySlug });
    if (category) query.category = category._id;
  }
  if (catalogGroup) query.catalogGroup = catalogGroup;

  const services = await Service.find(query)
    .populate("category")
    .sort({ order: 1, createdAt: -1 });

  if (!includeCatalogDefaults || !catalogGroup) {
    return NextResponse.json({ services });
  }

  const defaults = catalogGroup === "signboards" ? signboards : catalogGroup === "digital-printing" ? digitalPrinting : [];
  const serialized = JSON.parse(JSON.stringify(services));
  const bySlug = new Map(serialized.map((service) => [service.slug, service]));
  const merged = defaults.map((service) => ({
    ...service,
    ...(bySlug.get(service.slug) || {}),
    isCatalogDefault: true,
  }));
  const additions = serialized
    .filter((service) => !defaults.some((item) => item.slug === service.slug))
    .map((service) => ({ ...service, isCatalogDefault: false }));

  return NextResponse.json({ services: [...merged, ...additions] });
}

// POST /api/services -> create a new service (admin only — auth check to be added)
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["admin", "editor"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const body = await request.json();
  try {
    const service = await Service.create(body);
    return NextResponse.json({ service }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to create service. Check the submitted fields." }, { status: 400 });
  }
}
