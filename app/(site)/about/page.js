import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import StatsCounter from "@/components/ui/StatsCounter";

export const metadata = {
  title: "About Us",
  description:
    "Learn about U Graphics — a signage, advertising and web design company serving businesses across India.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About U Graphics"
        subtitle="Two specialties, one mission — helping businesses get noticed, offline and online."
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      {/* Company story */}
      <section className="section">
        <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Our Story"
              title="Built on Craft, Growing with Technology"
              align="left"
            />
            <p className="mt-4 text-ink/70">
              U Graphics started with a simple goal — help local businesses
              stand out. What began as a signage and advertising workshop has
              grown into a full-service creative partner, now offering
              custom website design and digital services alongside our
              signage work.
            </p>
            <p className="mt-4 text-ink/70">
              Whether it&apos;s a 3D LED signboard that turns heads on the street,
              or a website that turns visitors into customers, our approach
              stays the same: quality craftsmanship, honest pricing, and
              on-time delivery.
            </p>
          </div>
          <div className="relative h-72 rounded-card bg-surface-muted sm:h-96">
            <div className="flex h-full items-center justify-center text-ink/30">
              Company / Facility Photo Placeholder
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="section section-alt">
        <div className="container-page grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-card bg-white p-8 shadow-card">
            <h3 className="font-heading text-xl font-semibold text-primary">
              Our Mission
            </h3>
            <p className="mt-2 text-sm text-ink/70">
              To give every business — big or small — a visual identity that
              earns attention and trust, both on the street and online.
            </p>
          </div>
          <div className="rounded-card bg-white p-8 shadow-card">
            <h3 className="font-heading text-xl font-semibold text-primary">
              Our Vision
            </h3>
            <p className="mt-2 text-sm text-ink/70">
              To be India&apos;s most trusted name in signage and digital
              branding, known for reliability and design quality.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section">
        <div className="container-page">
          <StatsCounter
            stats={[
              { label: "Projects Completed", value: 500, suffix: "+" },
              { label: "Years of Experience", value: 10, suffix: "+" },
              { label: "Happy Clients", value: 300, suffix: "+" },
              { label: "Cities Served", value: 15, suffix: "+" },
            ]}
          />
        </div>
      </section>
    </>
  );
}
