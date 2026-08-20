import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Printer, Signpost } from "lucide-react";

export default function CatalogGrid({ group, items }) {
  const Icon = group === "Signboards" ? Signpost : Printer;
  const basePath = group === "Signboards" ? "/signboards" : "/digital-printing";
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {items.map((item) => <Link key={item.slug} href={`${basePath}/${item.slug}`} className="group overflow-hidden rounded-card border border-ink/10 bg-white transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-muted"><Image src={item.image} alt={`${item.title} by U Graphics`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover object-center" /></div><div className="p-5">
      <Icon aria-hidden="true" className="text-primary" size={24} />
      <h2 className="mt-4 font-heading text-base font-semibold text-ink">{item.title}</h2>
      <p className="mt-2 text-sm text-ink/65">{item.shortDescription || `Custom ${group.toLowerCase()} planned around your brand, application and finish.`}</p>
      <span className="mt-4 flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2">Explore service <ArrowRight size={15} /></span></div>
    </Link>)}
  </div>;
}
