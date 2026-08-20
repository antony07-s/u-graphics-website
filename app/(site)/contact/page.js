import { MapPin, Mail, Phone, MessageCircle } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import EnquiryForm from "@/components/forms/EnquiryForm";
import { siteConfig } from "@/lib/siteConfig";
import { getSiteSettings } from "@/lib/siteSettings";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contact Us",
  description:
    "Get in touch with U Graphics for signage and web design enquiries. Call, WhatsApp, or send us a message.",
};

function contactDetails(settings) {
  return [
  {
    icon: MapPin,
    label: "Address",
    value: settings.indiaAddress,
  },
  {
    icon: MapPin,
    label: "Malaysia Office",
    value: settings.malaysiaAddress,
  },
  {
    icon: Phone,
    label: "Phone",
    value: settings.malaysiaPhone,
    href: `tel:${settings.malaysiaPhone}`,
  },
  {
    icon: Mail,
    label: "Email",
    value: settings.email,
    href: `mailto:${settings.email}`,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Chat with us",
    href: `https://wa.me/${settings.whatsapp || siteConfig.whatsapp}`,
  },
  ];
}

export default async function ContactPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="Have a project in mind? Reach out and our team will get back to you shortly."
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <section className="section">
        <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-5">
          {/* Contact details */}
          <div className="lg:col-span-2">
            <h2 className="font-heading text-xl font-semibold text-ink">
              Get in Touch
            </h2>
            <p className="mt-2 text-sm text-ink/65">
              Prefer to talk directly? Reach us through any of these.
            </p>

            <div className="mt-6 flex flex-col gap-5">
              {contactDetails(settings).map(({ icon: Icon, label, value, href }) => {
                const content = (
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-ink/50">
                        {label}
                      </p>
                      <p className="font-medium text-ink">{value}</p>
                    </div>
                  </div>
                );
                return href ? (
                  <a key={label} href={href} target="_blank" rel="noreferrer">
                    {content}
                  </a>
                ) : (
                  <div key={label}>{content}</div>
                );
              })}
            </div>

            {/* Map placeholder — swap for a real embedded Google Map once address is finalized */}
            <div className="mt-8 flex h-56 items-center justify-center rounded-card bg-surface-muted text-sm text-ink/40">
              Map goes here
            </div>
          </div>

          {/* Form */}
          <div className="rounded-card bg-white p-6 shadow-card lg:col-span-3">
            <h2 className="font-heading text-xl font-semibold text-ink">
              Send Us a Message
            </h2>
            <p className="mt-2 text-sm text-ink/65">
              Fill out the form and we&apos;ll get back to you within 24
              hours.
            </p>
            <div className="mt-6">
              <EnquiryForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
