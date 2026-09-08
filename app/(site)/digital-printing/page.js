import PageHero from "@/components/ui/PageHero";
import CatalogGrid from "@/components/services/CatalogGrid";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import { categoryImageFallback } from "@/lib/categoryImageFallbacks";
export const dynamic = "force-dynamic";
export const metadata = { title: "Digital Printing", description: "Professional business printing, promotional products, packaging and branded print materials by U Graphics." };
export default async function DigitalPrintingPage() { await connectDB(); const categories = await Category.find({ section: "digital-printing" }).sort({ order: 1, name: 1 }).lean(); const items = categories.map((category, order) => ({ ...category, image: category.image || categoryImageFallback(category.name, "digital-printing", order, category.slug), href: `/products/${category.slug}`, title: category.name, shortDescription: category.description })); return <><PageHero title="Digital Printing" subtitle="Reliable print products that keep your brand consistent in every interaction." crumbs={[{label:"Home",href:"/"},{label:"Digital Printing"}]} /><section className="section"><div className="container-page"><p className="mb-8 max-w-3xl text-ink/70">Browse our print categories. Product images, specifications and pricing will be added to each category next.</p><CatalogGrid group="Digital Printing" items={items} /></div></section></>; }

