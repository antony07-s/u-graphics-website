import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Printer, Signpost } from "lucide-react";

export default function CatalogGrid({ group, items }) {
  const Icon = group === "Signboards" ? Signpost : Printer;
  const basePath = group === "Signboards" ? "/signboards" : "/digital-printing";
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {items.map((item) => { const title = item.title || item.name; const href = item.href || `${basePath}/${item.slug}`; return <Link key={item.slug} href={href} className="group overflow-hidden rounded-card border border-ink/10 bg-white transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-muted">{item.image ? <Image src={item.image} alt={`${title} by U Graphics`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover object-center" /> : <div className="flex h-full items-center justify-center bg-primary/5 text-center font-heading text-lg font-semibold text-primary/60">{title}</div>}</div><div className="p-5">
      <Icon aria-hidden="true" className="text-primary" size={24} />
      <h2 className="mt-4 font-heading text-base font-semibold text-ink">{title}</h2>
      <p className="mt-2 text-sm text-ink/65">{item.shortDescription || item.description || `Custom ${group.toLowerCase()} planned around your brand, application and finish.`}</p>
      <span className="mt-4 flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2">Explore category <ArrowRight size={15} /></span></div>
    </Link>; })}
  </div>;
}
