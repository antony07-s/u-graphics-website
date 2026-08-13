import Link from "next/link";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import StatsCounter from "@/components/ui/StatsCounter";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-24 text-white">
        <div className="container-page text-center">
          <h1 className="font-heading text-4xl font-bold sm:text-5xl">
            Signage & Web Design,{" "}
            <span className="text-accent">Built to Get You Noticed</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            U Graphics helps businesses across India stand out — from 3D LED
            signboards and vehicle branding to modern, high-converting websites.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button href="/get-a-quote" variant="primary" size="lg">
              Get a Free Quote
            </Button>
            <Button href="/portfolio" variant="outlineLight" size="lg">
              View Our Work
            </Button>
          </div>
        </div>
      </section>

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