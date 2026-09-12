import Link from "next/link";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import StatsCounter from "@/components/ui/StatsCounter";
import HeroSlider from "@/components/home/HeroSlider";
import { getSiteSettings } from "@/lib/siteSettings";
import { siteConfig } from "@/lib/siteConfig";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import ProductCard from "@/components/products/ProductCard";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import WatchAndBuy from "@/components/home/WatchAndBuy";
import TrustedByClients from "@/components/home/TrustedByClients";
import ReviewsSection from "@/components/home/ReviewsSection";
import OurStory from "@/components/home/OurStory";
import { categoryImageFallback } from "@/lib/categoryImageFallbacks";

export const dynamic = "force-dynamic";

const heroSlides = [
  {
    image: "/images/hero/heroslider1.jpeg",
    fit: "contain",
  },
];

export default async function HomePage() {
  const settings = await getSiteSettings();
  await connectDB();
  const [latestProducts, categoriesRaw] = await Promise.all([
    Product.find({}).sort({ createdAt: -1 }).limit(8).lean(),
    Category.find({ section: "signboards" }).sort({ order: 1, name: 1 }).limit(80).lean(),
  ]);

  const categories = categoriesRaw.map((category, order) => ({
    ...category,
    image: category.image || categoryImageFallback(category.name, "signboards", order, category.slug),
  }));

  const stats = settings.homepageStats?.length ? settings.homepageStats : siteConfig.homepageStats;
  return (
    <>
      <HeroSlider />

      <WatchAndBuy />

      <section className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow="What We Do"
            title="Three Specialties, One Team"
            subtitle="Signage, print and digital work that help your business get noticed."
          />
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card
              image="https://s.alicdn.com/@sc04/kf/Hcc4caebec67c4a2981a361b600611407Y/Large-Custom-Business-Logo-Sign-3D-Led-Backlit-Reverse-Channel-Letters-Professional-Laser-Cut-Illuminated-Sign.jpg"
              title="Signage & Advertising"
              description="3D LED signboards, lightboxes, vehicle branding, banners, safety signage and more."
              href="/signboards"
              tag="Signage"
              cta="Explore Signage Services"
            />
            <Card
              image="https://plus.unsplash.com/premium_photo-1682145481505-80614272c426?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGlnaXRhbCUyMHByaW5pdG5nfGVufDB8fDB8fHww"
              title="Digital Printing"
              description="Business cards, brochures, banners, stickers, packaging and branded products."
              href="/digital-printing"
              tag="Printing"
              cta="Explore Digital Printing"
            />
            <Card
              image="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1200&q=85"
              title="Web Design & Digital"
              description="Custom websites, e-commerce stores, redesigns and ongoing maintenance."
              href="/services?group=web-design"
              tag="Web Design"
              cta="Explore Web Design"
            />
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container-page">
          <StatsCounter
            stats={stats}
          />
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <SectionHeading eyebrow="Shop U Graphics" title="Latest Products" subtitle="Choose a product, set your quantity and request your custom print or signage order online." />
          {latestProducts.length ? (
            <>
              <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {latestProducts.map((product) => (
                  <ProductCard key={product._id.toString()} product={JSON.parse(JSON.stringify(product))} />
                ))}
              </div>
              <div className="mt-10 text-center">
                <Link href="/products" className="btn-outline">
                  View All Products
                </Link>
              </div>
            </>
          ) : <div className="mx-auto mt-8 max-w-2xl rounded-card border border-primary/10 bg-surface-muted p-6 text-center"><p className="font-heading text-lg font-semibold text-ink">Product pricing is being added</p><p className="mt-2 text-sm text-ink/65">Our catalogue needs real product images, price tiers, minimum quantities and stock before products can safely be sold online.</p><Link href="/signboards" className="btn-primary mt-5 text-sm">Explore Signboards</Link></div>}
        </div>
      </section>

      {categories.length > 0 && <section className="section section-alt"><div className="container-page"><SectionHeading eyebrow="Explore" title="Browse Signage Categories" subtitle="Choose a category to explore custom options for your business." /><CategoryShowcase categories={JSON.parse(JSON.stringify(categories))} /></div></section>}

      <TrustedByClients />
      <ReviewsSection />
      <OurStory />
    </>
  );
}
