import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, MessageSquare } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { serviceDescription } from "@/lib/serviceCatalog";

export default function CatalogDetail({ service, group, related, projects = [] }) {
  const groupPath = group === "Signboards" ? "/signboards" : "/digital-printing";
  return <><PageHero title={service.title} subtitle={`${group} by U Graphics`} crumbs={[{ label: "Home", href: "/" }, { label: group, href: groupPath }, { label: service.title }]} />
    <section className="section"><div className="container-page grid gap-10 lg:grid-cols-3"><article className="lg:col-span-2">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-card bg-surface-muted"><Image src={service.image} alt={`${service.title} by U Graphics`} fill priority sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover object-center" /></div><p className="mt-6 text-lg leading-8 text-ink/75">{service.description || serviceDescription(service)}</p>
      {service.gallery?.length > 0 && <div className="mt-5 grid gap-4 sm:grid-cols-2">{service.gallery.map((image, index) => <div key={image} className="relative aspect-[4/3] overflow-hidden rounded-card bg-surface-muted"><Image src={image} alt={`${service.title} gallery image ${index + 1}`} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" /></div>)}</div>}
      <h2 className="mt-8 font-heading text-2xl font-semibold">Made for your business</h2>
      <ul className="mt-4 grid gap-3 text-ink/70 sm:grid-cols-2">{["Material and finish guidance", "Artwork review before production", "Quality-focused fabrication or printing", "Clear quote and delivery plan"].map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 shrink-0 text-primary" size={18} />{item}</li>)}</ul>
      {projects.length > 0 && <div className="mt-10"><h2 className="font-heading text-2xl font-semibold">Recent work for this service</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">{projects.map((project) => <Link key={project._id} href={`/portfolio/${project.slug}`} className="rounded-card border border-ink/10 p-4 transition hover:border-primary/30 hover:shadow-card"><p className="font-heading font-semibold text-ink">{project.title}</p>{project.location && <p className="mt-1 text-sm text-ink/60">{project.location}</p>}</Link>)}</div></div>}
      <h2 className="mt-10 font-heading text-2xl font-semibold">Related services</h2><div className="mt-4 flex flex-wrap gap-2">{related.filter((item) => item.slug !== service.slug).slice(0, 4).map((item) => <Link key={item.slug} href={`${groupPath}/${item.slug}`} className="rounded-full bg-surface-muted px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white">{item.title}</Link>)}</div>
    </article><aside className="h-fit rounded-card bg-surface-muted p-6"><h2 className="font-heading text-xl font-semibold">Plan this project</h2><p className="mt-2 text-sm text-ink/65">Share your requirements for a tailored recommendation and quote.</p><Link href={`/get-a-quote?service=${encodeURIComponent(service.title)}`} className="btn-primary mt-6 w-full">Get a Quote</Link><Link href="/contact" className="btn-outline mt-3 w-full"><MessageSquare size={16} /> Contact U Graphics</Link></aside></div></section>
  </>;
}
