import PageHero from "@/components/ui/PageHero";
import ServicesGrid from "@/components/services/ServicesGrid";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import Service from "@/models/Service";

export const metadata = {
  title: "Services",
  description:
    "Explore U Graphics' full range of services — signage, LED signboards, vehicle branding, and web design for businesses.",
};

export const dynamic = "force-dynamic";

async function getData() {
  await connectDB();

  const [categories, services] = await Promise.all([
    Category.find({}).sort({ order: 1, name: 1 }).lean(),
    Service.find({}).populate("category").sort({ order: 1, createdAt: -1 }).lean(),
  ]);

  const safe = (doc) => JSON.parse(JSON.stringify(doc));

  return {
    categories: categories.map(safe),
    services: services.map(safe),
  };
}

export default async function ServicesPage() {
  const { categories, services } = await getData();

  return (
    <>
      <PageHero
        title="Our Services"
        subtitle="Signage and web design services built to help your business get noticed — offline and online."
        crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
      />

      <section className="section">
        <div className="container-page">
          <ServicesGrid categories={categories} services={services} />
        </div>
      </section>
    </>
  );
}
