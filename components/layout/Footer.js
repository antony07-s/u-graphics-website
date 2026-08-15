import Link from "next/link";
import { MapPin, Mail, Phone, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";
import { getSiteSettings } from "@/lib/siteSettings";

export default async function Footer() {
  const settings = await getSiteSettings();
  return (
    <footer className="bg-primary-dark bg-[#082C6B] text-white">
      <div className="container-page grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-1 font-heading text-xl font-bold">
            <span>U</span>
            <span className="text-accent">GRAPHICS</span>
          </div>
          <p className="mt-3 text-sm text-white/70">
            Signboards, advertising & web design — helping businesses across
            India build a stronger visual presence, online and offline.
          </p>
          <a href={`https://wa.me/${settings.whatsapp || siteConfig.whatsapp}`} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white hover:text-accent"><MessageCircle size={17} /> WhatsApp U Graphics</a>
          {Object.entries(settings.socialLinks || {}).filter(([, url]) => url).length > 0 && <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm">{Object.entries(settings.socialLinks).filter(([, url]) => url).map(([platform, url]) => <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="capitalize text-white/70 hover:text-accent">{platform}</a>)}</div>}
        </div>

        <div>
          <h4 className="font-heading font-semibold">Quick Links</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li><Link href="/about" className="hover:text-accent">About Us</Link></li>
            <li><Link href="/services" className="hover:text-accent">Services</Link></li>
            <li><Link href="/portfolio" className="hover:text-accent">Portfolio</Link></li>
            <li><Link href="/blog" className="hover:text-accent">Blog</Link></li>
            <li><Link href="/get-a-quote" className="hover:text-accent">Get a Quote</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold">Our Services</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li><Link href="/services#signage" className="hover:text-accent">Signage & Advertising</Link></li>
            <li><Link href="/services#web-design" className="hover:text-accent">Web Design & Digital</Link></li>
            <li><Link href="/portfolio" className="hover:text-accent">Our Projects</Link></li>
            <li><Link href="/careers" className="hover:text-accent">Careers</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold">Contact</h4>
          <ul className="mt-3 space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              <span>{settings.indiaAddress}</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              <span>{settings.malaysiaAddress}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> <a href={`tel:${settings.malaysiaPhone}`} className="hover:text-accent">{settings.malaysiaPhone}</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} /> <a href={`mailto:${settings.email}`} className="hover:text-accent">{settings.email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <div className="container-page flex flex-col items-center justify-between gap-2 text-xs text-white/60 sm:flex-row">
          <p>© {new Date().getFullYear()} U Graphics. All rights reserved.</p>
          <Link href="/privacy-policy" className="hover:text-accent">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
