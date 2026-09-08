"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, X } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

// Temporary placeholder data — replace "thumbnail" with real Cloudinary image
// URLs and "videoUrl" with real Cloudinary video URLs once you upload them
// via the admin panel. Leave videoUrl as null if a video isn't ready yet —
// the card will still show, just without a play button.
const watchAndBuyItems = [
  {
    id: "1",
    title: "Kids Notebook Cover",
    price: "₹140.00",
    thumbnail:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80",
    videoUrl: null, // e.g. "https://res.cloudinary.com/YOUR_CLOUD/video/upload/u-graphics/kids-notebook.mp4"
    href: "/products",
  },
  {
    id: "2",
    title: "Embossed Stone Print",
    price: "₹2,965.25",
    thumbnail:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80",
    videoUrl: null,
    href: "/products",
  },
  {
    id: "3",
    title: "Square/Rectangle Stickers",
    price: "₹288.96",
    thumbnail:
      "https://images.unsplash.com/photo-1543123452-278551b0e9a7?w=400&q=80",
    videoUrl: null,
    href: "/products",
  },
  {
    id: "4",
    title: "Round Stickers",
    price: "₹130.24",
    thumbnail:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80",
    videoUrl: null,
    href: "/products",
  },
  {
    id: "5",
    title: "Stand Up Pouch",
    price: "₹12.90",
    thumbnail:
      "https://images.unsplash.com/photo-1624137527136-66e631bdaa0e?w=400&q=80",
    videoUrl: null,
    href: "/products",
  },
  {
    id: "6",
    title: "Business Cards",
    price: "₹250.85",
    thumbnail:
      "https://images.unsplash.com/photo-1599590984817-0c15f31b1fa5?w=400&q=80",
    videoUrl: null,
    href: "/products",
  },
];

export default function WatchAndBuy() {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <section className="section">
      <div className="container-page">
        <SectionHeading eyebrow="See It In Action" title="Watch & Buy" />

        <div className="mt-8 -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide sm:mx-0 sm:px-0">
          {watchAndBuyItems.map((item) => (
            <div
              key={item.id}
              className="group flex w-40 shrink-0 flex-col overflow-hidden rounded-card bg-white shadow-card transition hover:shadow-cardHover sm:w-48"
            >
              <button
                type="button"
                onClick={() => item.videoUrl && setActiveVideo(item)}
                className="relative aspect-square w-full overflow-hidden bg-surface-muted"
              >
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="200px"
                />
                {/* Only show play button if a real video is attached */}
                {item.videoUrl && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-primary shadow-md transition group-hover:scale-110">
                      <Play size={18} className="ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                )}
              </button>
              <Link href={item.href} className="p-3">
                <p className="line-clamp-1 text-sm font-medium text-ink">
                  {item.title}
                </p>
                <p className="mt-1 text-sm font-semibold text-accent">
                  {item.price}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Video modal — only renders when a video is clicked */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setActiveVideo(null)}
        >
          <button
            onClick={() => setActiveVideo(null)}
            aria-label="Close video"
            className="absolute right-5 top-5 text-white/80 hover:text-white"
          >
            <X size={28} />
          </button>
          <video
            src={activeVideo.videoUrl}
            controls
            autoPlay
            className="max-h-[80vh] max-w-full rounded-card"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
