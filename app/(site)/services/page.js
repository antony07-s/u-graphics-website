import PageHero from "@/components/ui/PageHero";
import ServicesGrid from "@/components/services/ServicesGrid";
import Card from "@/components/ui/Card";
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
    Category.find({ group: "web-design" }).sort({ order: 1, name: 1 }).lean(),
    Service.find({ catalogGroup: { $exists: false } }).populate({ path: "category", match: { group: "web-design" } }).sort({ order: 1, createdAt: -1 }).lean(),
  ]);

  const safe = (doc) => JSON.parse(JSON.stringify(doc));

  return {
    categories: categories.map(safe),
    services: services.filter((service) => service.category).map(safe),
  };
}

export default async function ServicesPage() {
  const { categories, services } = await getData();

  return (
    <>
      <PageHero
        title="Our Services"
        subtitle="Explore U Graphics solutions for physical branding, digital printing and web design."
        crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
      />

      <section className="section">
        <div className="container-page">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card title="Signboards" description="Explore 3D LED, stainless steel, pylon, lightbox and directional signage." href="/signboards" tag="20 Services" cta="Explore Signboards" />
            <Card title="Digital Printing" description="Browse business print, promotional products, packaging and branded materials." href="/digital-printing" tag="20 Services" cta="Explore Digital Printing" />
            <Card title="Web Design & Digital" description="Websites and digital services designed to help your business convert online." href="/services?group=web-design#web-design" tag="Digital" cta="Explore Web Design" />
          </div>
          <div id="web-design" className="mt-16 scroll-mt-24">
            <h2 className="font-heading text-2xl font-semibold text-ink">Web Design & Digital</h2>
            <p className="mt-2 max-w-2xl text-ink/65">Explore our database-managed web design and digital services.</p>
            <div className="mt-8"><ServicesGrid categories={categories} services={services} /></div>
          </div>
        </div>
      </section>
    </>
  );
}
