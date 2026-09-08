"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

// TEMPORARY placeholder — replace with a real company video later.
// If you have a real video on Cloudinary or YouTube, set videoEmbedUrl
// below and it will show automatically. Leave it null to just show the
// static placeholder image with a play icon (non-functional for now).
const ourStory = {
  image:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
  videoEmbedUrl: null, // e.g. "https://www.youtube.com/embed/VIDEO_ID"
  paragraphs: [
    "U Graphics started with a simple goal — help local businesses stand out. What began as a signage and advertising workshop has grown into a full-service creative partner, now offering digital printing and custom website design alongside our signage work.",
    "Whether it's a 3D LED signboard that turns heads on the street, a custom print run for your brand, or a website that turns visitors into customers, our approach stays the same: quality craftsmanship, honest pricing, and on-time delivery.",
  ],
};

export default function OurStory() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="section section-alt">
      <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Who We Are"
            title="Our Story"
            align="left"
          />
          <div className="mt-4 space-y-4">
            {ourStory.paragraphs.map((p, i) => (
              <p key={i} className="text-ink/70">
                {p}
              </p>
            ))}
          </div>
        </div>

        <div className="relative aspect-video w-full overflow-hidden rounded-card bg-surface-muted shadow-card">
          {playing && ourStory.videoEmbedUrl ? (
            <iframe
              src={`${ourStory.videoEmbedUrl}?autoplay=1`}
              title="Our Story"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="h-full w-full"
            />
          ) : (
            <button
              type="button"
              onClick={() => ourStory.videoEmbedUrl && setPlaying(true)}
              className="group relative h-full w-full"
            >
              <img
                src={ourStory.image}
                alt="Our Story"
                className="h-full w-full object-cover"
              />
              {ourStory.videoEmbedUrl && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/40">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg transition group-hover:scale-110">
                    <Play size={28} className="ml-1" fill="currentColor" />
                  </div>
                </div>
              )}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
