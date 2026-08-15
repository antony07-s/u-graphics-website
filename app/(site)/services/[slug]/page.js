import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Lightbox from "@/components/ui/Lightbox";
import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";
import Category from "@/models/Category"; // ensures the model is registered for populate()

export const revalidate = 3600;

async function getService(slug) {
  await connectDB();
  const service = await Service.findOne({ slug }).populate("category").lean();
  if (!service) return null;
  return JSON.parse(JSON.stringify(service));
}

export async function generateMetadata({ params }) {
  const service = await getService(params.slug);
  if (!service) return {};
  return {
    title: service.title,
    description:
      service.shortDescription || service.description?.slice(0, 155),
  };
}

export default async function ServiceDetailPage({ params }) {
  const service = await getService(params.slug);
  if (!service) notFound();

  const galleryImages = [service.image, ...(service.gallery || [])].filter(
    Boolean
  );

  return (
    <>
      <PageHero
        title={service.title}
        subtitle={service.category?.name}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.title },
        ]}
      />

      <section className="section">
        <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="relative h-72 w-full overflow-hidden rounded-card bg-surface-muted sm:h-96">
              {service.image ? (
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-ink/30">
                  No image yet
                </div>
              )}
            </div>

            {service.shortDescription && (
              <p className="mt-6 text-lg font-medium text-ink">
                {service.shortDescription}
              </p>
            )}

            {service.description && (
              <div className="mt-4 whitespace-pre-line text-ink/70">
                {service.description}
              </div>
            )}

            {galleryImages.length > 1 && (
              <div className="mt-8">
                <h3 className="mb-4 font-heading text-lg font-semibold text-ink">
                  Gallery
                </h3>
                <Lightbox images={galleryImages} />
              </div>
            )}
          </div>

          <aside className="h-fit rounded-card bg-surface-muted p-6">
            <h3 className="font-heading text-lg font-semibold text-ink">
              Why Choose This Service
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-ink/70">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" />
                Free consultation and site assessment
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" />
                Custom design tailored to your brand
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" />
                Professional installation and support
              </li>
            </ul>

            <Link href="/get-a-quote" className="btn-primary mt-6 block text-center">
              Get a Quote for This Service
            </Link>
            <a
              href="/contact"
              className="btn-outline mt-3 block text-center"
            >
              Ask a Question
            </a>
          </aside>
        </div>
      </section>
    </>
  );
}