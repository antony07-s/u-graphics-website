import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * items: [{ label: "Home", href: "/" }, { label: "Services" }]
 * Last item (no href) renders as plain text = current page.
 */
export default function Breadcrumb({ items = [], light = false }) {
  const textColor = light ? "text-white/70" : "text-ink/60";
  const linkColor = light ? "text-white hover:text-accent" : "text-primary hover:text-accent";

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1">
            {item.href && !isLast ? (
              <Link href={item.href} className={linkColor}>
                {item.label}
              </Link>
            ) : (
              <span className={textColor}>{item.label}</span>
            )}
            {!isLast && <ChevronRight size={14} className={textColor} />}
          </span>
        );
      })}
    </nav>
  );
}
