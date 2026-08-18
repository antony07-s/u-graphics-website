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
    // Fully designed banner — no overlay text needed since the graphic
    // already has the headline, icons and branding built in.
    image: "/images/hero/heroslider1.jpeg",
    fit: "contain",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <HeroSlider />

      {/* Services overview */}
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
