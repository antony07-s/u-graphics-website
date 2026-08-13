"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * images: array of image URLs.
 * Renders a thumbnail grid; clicking opens a full-screen modal viewer.
 */
export default function Lightbox({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const close = () => setActiveIndex(null);
  const prev = (e) => {
    e.stopPropagation();
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };
  const next = (e) => {
    e.stopPropagation();
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className="relative h-40 overflow-hidden rounded-card bg-surface-muted"
          >
            <Image src={src} alt={`Gallery image ${i + 1}`} fill className="object-cover transition hover:scale-105" />
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
          onClick={close}
        >
          <button
            onClick={close}
            aria-label="Close"
            className="absolute right-5 top-5 text-white/80 hover:text-white"
          >
            <X size={28} />
          </button>
          <button
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-3 text-white/80 hover:text-white sm:left-6"
          >
            <ChevronLeft size={36} />
          </button>
          <div className="relative h-[70vh] w-full max-w-3xl">
            <Image
              src={images[activeIndex]}
              alt={`Gallery image ${activeIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>
          <button
            onClick={next}
            aria-label="Next image"
            className="absolute right-3 text-white/80 hover:text-white sm:right-6"
          >
            <ChevronRight size={36} />
          </button>
        </div>
      )}
    </>
  );
}
