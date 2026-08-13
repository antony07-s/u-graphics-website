import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Generic content card used for Services, Projects, and Blog listings.
 * `tag` shows a small category label (e.g. "Signage" or "Web Design").
 */
export default function Card({ image, title, description, href, tag, cta = "Learn More" }) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-card bg-white shadow-card transition hover:-translate-y-1 hover:shadow-cardHover"
    >
      <div className="relative h-52 w-full overflow-hidden bg-surface-muted">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink/30">
            No image yet
          </div>
        )}
        {tag && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
            {tag}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-lg font-semibold text-ink">{title}</h3>
        {description && (
          <p className="mt-2 line-clamp-2 text-sm text-ink/65">{description}</p>
        )}
        <span className="mt-4 flex items-center gap-1 text-sm font-medium text-primary transition group-hover:gap-2">
          {cta} <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}
