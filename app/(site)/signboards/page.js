import PageHero from "@/components/ui/PageHero";
import CatalogGrid from "@/components/services/CatalogGrid";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import { categoryImageFallback } from "@/lib/categoryImageFallbacks";
export const dynamic = "force-dynamic";
export const metadata = { title: "Signboards", description: "Custom LED, 3D, stainless steel, pylon and directional signboards by U Graphics." };
export default async function SignboardsPage() { await connectDB(); const categories = await Category.find({ section: "signboards" }).sort({ order: 1, name: 1 }).lean(); const items = categories.map((category, order) => ({ ...category, image: category.image || categoryImageFallback(category.name, "signboards", order), href: `/products/${category.slug}`, title: category.name, shortDescription: category.description })); return <><PageHero title="Signboards" subtitle="Commercial signage designed, fabricated and finished for your brand." crumbs={[{label:"Home",href:"/"},{label:"Signboards"}]} /><section className="section"><div className="container-page"><p className="mb-8 max-w-3xl text-ink/70">Browse our signage categories. Product images, specifications and pricing will be added to each category next.</p><CatalogGrid group="Signboards" items={items} /></div></section></>; }
