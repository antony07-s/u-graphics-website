import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Lightbox from "@/components/ui/Lightbox";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import Category from "@/models/Category"; // ensures the model is registered for populate()

export const revalidate = 3600;

async function getProject(slug) {
  await connectDB();
  const project = await Project.findOne({ slug }).populate("category").lean();
  if (!project) return null;
  return JSON.parse(JSON.stringify(project));
}

export async function generateMetadata({ params }) {
  const project = await getProject(params.slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description?.slice(0, 155),
  };
}

export default async function ProjectDetailPage({ params }) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  const galleryImages = [project.coverImage, ...(project.gallery || [])].filter(
    Boolean
  );

  return (
    <>
      <PageHero
        title={project.title}
        subtitle={project.category?.name}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Portfolio", href: "/portfolio" },
          { label: project.title },
        ]}
      />

      <section className="section">
        <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="relative h-72 w-full overflow-hidden rounded-card bg-surface-muted sm:h-96">
              <Image
                src={project.coverImage}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {project.description && (
              <p className="mt-6 text-ink/70">{project.description}</p>
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

          <aside className="rounded-card bg-surface-muted p-6">
            <h3 className="font-heading text-lg font-semibold text-ink">
              Project Details
            </h3>
            <dl className="mt-4 space-y-3 text-sm">
              {project.category?.name && (
                <div>
                  <dt className="text-ink/50">Category</dt>
                  <dd className="font-medium text-ink">{project.category.name}</dd>
                </div>
              )}
              {project.location && (
                <div>
                  <dt className="text-ink/50">Location</dt>
                  <dd className="font-medium text-ink">{project.location}</dd>
                </div>
              )}
              {project.clientName && (
                <div>
                  <dt className="text-ink/50">Client</dt>
                  <dd className="font-medium text-ink">{project.clientName}</dd>
                </div>
              )}
            </dl>

            <Link href="/get-a-quote" className="btn-primary mt-6 block text-center">
              Get a Quote Like This
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}