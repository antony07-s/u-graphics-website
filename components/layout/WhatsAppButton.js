"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "91XXXXXXXXXX";
  const message = encodeURIComponent("Hi, I'm interested in your services.");

  return (
    <a
      href={`https://wa.me/${number}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-cardHover transition hover:scale-110 lg:bottom-6"
    >
      <MessageCircle size={26} />
    </a>
  );
}
