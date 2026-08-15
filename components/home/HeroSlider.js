"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";

/**
 * slides: [{ image: "https://..." or "/hero/slide1.jpg", title, subtitle }]
 * Auto-rotates every `interval` ms, pauses on hover, with manual arrows + dots.
 * Falls back to the plain gradient hero if no slides are passed.
 */
export default function HeroSlider({ slides = [], interval = 6000 }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (i) => setIndex((i + slides.length) % slides.length),
    [slides.length]
  );
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const t = setInterval(next, interval);
    return () => clearInterval(t);
  }, [paused, next, interval, slides.length]);

  if (slides.length === 0) {
    return (
      <section className="bg-gradient-to-br from-primary to-primary-dark py-24 text-white">
        <div className="container-page text-center">
          <h1 className="font-heading text-4xl font-bold sm:text-5xl">
            Signage & Web Design,{" "}
            <span className="text-accent">Built to Get You Noticed</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            U Graphics helps businesses across India stand out — from 3D LED
            signboards and vehicle branding to modern, high-converting
            websites.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button href="/get-a-quote" variant="primary" size="lg">
              Get a Free Quote
            </Button>
            <Button href="/portfolio" variant="outlineLight" size="lg">
              View Our Work
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative h-[380px] w-full overflow-hidden sm:h-[480px] lg:h-[560px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          } ${slide.fit === "contain" ? "bg-[#0b0f1a]" : ""}`}
        >
          <Image
            src={slide.image}
            alt={slide.title || `Slide ${i + 1}`}
            fill
            priority={i === 0}
            className={slide.fit === "contain" ? "object-contain" : "object-cover"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          {(slide.title || slide.subtitle) && (
            <div className="container-page absolute inset-0 flex flex-col items-start justify-end pb-14 text-white">
              {slide.title && (
                <h1 className="max-w-xl font-heading text-3xl font-bold sm:text-4xl lg:text-5xl">
                  {slide.title}
                </h1>
              )}
              {slide.subtitle && (
                <p className="mt-3 max-w-lg text-sm text-white/85 sm:text-base">
                  {slide.subtitle}
                </p>
              )}
            </div>
          )}
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur transition hover:bg-white/40 sm:left-6"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur transition hover:bg-white/40 sm:right-6"
          >
            <ChevronRight size={24} />
          </button>

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-accent" : "w-2 bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}