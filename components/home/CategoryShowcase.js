"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ImageIcon } from "lucide-react";
import { useState } from "react";

export default function CategoryShowcase({ categories }) {
  const [visible, setVisible] = useState(8);
  const displayed = categories.slice(0, visible);

  return <>
    <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
      {displayed.map((category) => <Link key={category._id.toString()} href={`/products/${category.slug}`} className="group flex min-h-24 items-center gap-3 rounded-card border border-ink/10 bg-white p-3 shadow-card transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-cardHover sm:min-h-28 sm:gap-4 sm:p-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-primary/5 sm:h-16 sm:w-16">
          {category.image ? <Image src={category.image} alt="" fill sizes="64px" className="object-cover" /> : <div className="flex h-full w-full items-center justify-center text-primary"><ImageIcon size={22} aria-hidden="true" /></div>}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 font-heading text-base font-semibold leading-5 text-ink group-hover:text-primary">{category.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-ink/60">{category.description || `Custom ${category.name.toLowerCase()} for your business and project needs.`}</p>
        </div>
        <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink/60 transition group-hover:border-primary group-hover:bg-primary group-hover:text-white sm:h-10 sm:w-10"><ArrowRight size={18} /></span>
      </Link>)}
    </div>
    {visible < categories.length && <div className="mt-7 text-center"><button type="button" onClick={() => setVisible((count) => Math.min(count + 8, categories.length))} className="btn-outline text-sm">Show More Categories</button></div>}
  </>;
}
