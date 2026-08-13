"use client";

import Link from "next/link";
import { Phone, MessageCircle, FileText } from "lucide-react";

export default function MobileActionBar() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "91XXXXXXXXXX";

  return (
    <div className="fixed bottom-0 left-0 z-40 flex w-full items-stretch bg-primary text-white shadow-[0_-4px_12px_rgba(0,0,0,0.15)] lg:hidden">
      <a
        href="tel:+91XXXXXXXXXX"
        className="flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-xs font-medium"
      >
        <Phone size={18} />
        Call
      </a>
      <a
        href={`https://wa.me/${number}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 flex-col items-center justify-center gap-1 border-x border-white/15 py-2.5 text-xs font-medium"
      >
        <MessageCircle size={18} />
        WhatsApp
      </a>
      <Link
        href="/get-a-quote"
        className="flex flex-1 flex-col items-center justify-center gap-1 bg-accent py-2.5 text-xs font-medium"
      >
        <FileText size={18} />
        Get Quote
      </Link>
    </div>
  );
}
