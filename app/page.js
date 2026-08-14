import Link from "next/link";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import StatsCounter from "@/components/ui/StatsCounter";
import HeroSlider from "@/components/home/HeroSlider";

// TEMPORARY placeholder photos — replace with your own signage/web project
// photos once available (via Cloudinary once the admin panel is built, or
// by dropping images into /public/hero and updating the paths below).
const heroSlides = [
  {
    image:
      "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=1600&q=80",
    title: "Signage That Gets You Noticed",
    subtitle:
      "3D LED signboards, acrylic signage, lightboxes and vehicle branding — built to last.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80",
    title: "Websites Built to Convert",
    subtitle:
      "Fast, modern business websites that turn visitors into customers.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&q=80",
    title: "One Team, End to End",
    subtitle: "From design and fabrication to installation and support.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <HeroSlider slides={heroSlides} />

      {/* Services overview */}
      <section className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow="What We Do"
            title="Two Specialties, One Team"
            subtitle="Signage that gets seen offline, and websites that get seen online."
          />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Card
              title="Signage & Advertising"
              description="3D LED signboards, lightboxes, vehicle branding, banners, safety signage and more."
              href="/services#signage"
              tag="Signage"
              cta="Explore Signage Services"
            />
            <Card
              title="Web Design & Digital"
              description="Custom websites, e-commerce stores, redesigns and ongoing maintenance."
              href="/services#web-design"
              tag="Web Design"
              cta="Explore Web Design"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section section-alt">
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