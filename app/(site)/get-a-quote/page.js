import { Clock, ShieldCheck, Wallet } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import EnquiryForm from "@/components/forms/EnquiryForm";
import { siteConfig, whatsappUrl } from "@/lib/siteConfig";

export const metadata = {
  title: "Get a Free Quote",
  description:
    "Request a free, no-obligation quote from U Graphics for signage or web design work. We usually respond within 24 hours.",
};

const reasons = [
  {
    icon: Clock,
    title: "Fast Response",
    description: "We typically reply within 24 hours on business days.",
  },
  {
    icon: Wallet,
    title: "No Obligation",
    description: "Getting a quote is free — no pressure, no hidden fees.",
  },
  {
    icon: ShieldCheck,
    title: "Honest Pricing",
    description: "Transparent quotes based on your actual requirements.",
  },
];

export default function GetAQuotePage() {
  return (
    <>
      <PageHero
        title="Get a Free Quote"
        subtitle="Tell us a bit about your project and we'll get back to you with pricing and next steps."
        crumbs={[{ label: "Home", href: "/" }, { label: "Get a Quote" }]}
      />

      <section className="section">
        <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-5">
          {/* Trust signals */}
          <div className="lg:col-span-2">
            <h2 className="font-heading text-xl font-semibold text-ink">
              Why Request a Quote From Us?
            </h2>

            <div className="mt-6 flex flex-col gap-6">
              {reasons.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-ink">
                      {title}
                    </h3>
                    <p className="mt-1 text-sm text-ink/65">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-card bg-surface-muted p-6">
              <h3 className="font-heading font-semibold text-ink">
                Prefer to talk directly?
              </h3>
              <p className="mt-2 text-sm text-ink/65">
                Call or WhatsApp us and we&apos;ll walk you through your
                options right away.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a href={`tel:${siteConfig.malaysiaPhone}`} className="btn-outline text-sm">
                  Call Us
                </a>
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary text-sm"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-card bg-white p-6 shadow-card lg:col-span-3">
            <h2 className="font-heading text-xl font-semibold text-ink">
              Request Your Quote
            </h2>
            <p className="mt-2 text-sm text-ink/65">
              The more detail you share, the more accurate your quote will
              be.
            </p>
            <div className="mt-6">
              <EnquiryForm
                submitLabel="Request My Quote"
                successMessage="Thanks — your quote request has been received. We'll be in touch within 24 hours with pricing and next steps."
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
