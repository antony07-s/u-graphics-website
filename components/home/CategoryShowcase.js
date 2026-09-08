"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ImageIcon } from "lucide-react";
import { useState } from "react";

export default function CategoryShowcase({ categories }) {
  const [visible, setVisible] = useState(8);
  const displayed = categories.slice(0, visible);

  return <>
    <div className="mt-8 grid gap-4 md:grid-cols-2">
      {displayed.map((category) => <Link key={category._id.toString()} href={`/products/${category.slug}`} className="group flex min-h-28 items-center gap-4 rounded-card border border-ink/10 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-cardHover">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-primary/5">
          {category.image ? <Image src={category.image} alt="" fill sizes="64px" className="object-cover" /> : <div className="flex h-full w-full items-center justify-center text-primary"><ImageIcon size={22} aria-hidden="true" /></div>}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-heading text-base font-semibold text-ink group-hover:text-primary">{category.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-ink/60">{category.description || `Custom ${category.name.toLowerCase()} for your business and project needs.`}</p>
        </div>
        <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink/60 transition group-hover:border-primary group-hover:bg-primary group-hover:text-white"><ArrowRight size={18} /></span>
      </Link>)}
    </div>
    {visible < categories.length && <div className="mt-7 text-center"><button type="button" onClick={() => setVisible((count) => Math.min(count + 8, categories.length))} className="btn-outline text-sm">Show More Categories</button></div>}
  </>;
}
