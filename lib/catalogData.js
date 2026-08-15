import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";

export async function getManagedCatalog(group, defaults) {
  try {
    await connectDB();
    const managed = await Service.find({ catalogGroup: group }).sort({ order: 1, createdAt: 1 }).lean();
    if (!managed.length) return defaults;
    const bySlug = new Map(managed.map((service) => [service.slug, JSON.parse(JSON.stringify(service))]));
    const merged = defaults.map((service) => ({ ...service, ...(bySlug.get(service.slug) || {}) }));
    const additions = managed.filter((service) => !defaults.some((item) => item.slug === service.slug)).map((service) => JSON.parse(JSON.stringify(service)));
    return [...merged, ...additions];
  } catch {
    return defaults;
  }
}
