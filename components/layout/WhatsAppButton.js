"use client";

import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/siteConfig";
import { useSiteSettings } from "@/components/providers/useSiteSettings";

export default function WhatsAppButton() {
  const settings = useSiteSettings();
  return (
    <a
      href={settings.whatsapp ? `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Hi, I'm interested in U Graphics services.")}` : whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-cardHover transition hover:scale-110 lg:bottom-6"
    >
      <MessageCircle size={26} />
    </a>
  );
}
