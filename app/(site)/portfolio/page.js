import PageHero from "@/components/ui/PageHero";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import Project from "@/models/Project";

export const metadata = {
  title: "Portfolio",
  description:
    "Browse completed signage and web design projects by U Graphics — 3D LED signboards, acrylic signage, vehicle branding, business websites and more.",
};

// Revalidate every hour so new projects/categories show up without a full redeploy.
export const dynamic = "force-dynamic";

async function getData() {
  await connectDB();

  const [categories, projects] = await Promise.all([
    Category.find({}).sort({ order: 1, name: 1 }).lean(),
    Project.find({}).populate("category").sort({ createdAt: -1 }).lean(),
  ]);

  // Serialize Mongo ObjectIds/Dates so this can be passed to a client component.
  const safe = (doc) => JSON.parse(JSON.stringify(doc));

  return {
    categories: categories.map(safe),
    projects: projects.map(safe),
  };
}

export default async function PortfolioPage() {
  const { categories, projects } = await getData();

  return (
    <>
      <PageHero
        title="Our Portfolio"
        subtitle="A look at signage and web projects we've completed for businesses across the region."
        crumbs={[{ label: "Home", href: "/" }, { label: "Portfolio" }]}
      />

      <section className="section">
        <div className="container-page">
          <PortfolioGrid categories={categories} projects={projects} />
        </div>
      </section>
    </>
  );
}
