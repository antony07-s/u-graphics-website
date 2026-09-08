import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";
import { getSiteSettings } from "@/lib/siteSettings";
import LocationToggle from "@/components/layout/LocationToggle";

export default async function Footer() {
  const settings = await getSiteSettings();
  return (
    <footer className="bg-primary-dark bg-[#082C6B] text-white">
      {/* Categories mega-list - linked to real product pages using the
          actual catalog slugs from lib/catalog-data.js, not invented ones. */}
      <div className="border-b border-white/10">
        <div className="container-page grid grid-cols-2 gap-8 py-12 sm:grid-cols-3">
          <div>
            <h4 className="font-heading font-semibold">Business Cards & Stationery</h4>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li><Link href="/digital-printing/business-card" className="hover:text-accent">Business Cards</Link></li>
              <li><Link href="/digital-printing/letterhead" className="hover:text-accent">Letterhead</Link></li>
              <li><Link href="/digital-printing/envelope" className="hover:text-accent">Envelope</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold">Labels & Stickers</h4>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li><Link href="/digital-printing/sticker" className="hover:text-accent">Stickers</Link></li>
              <li><Link href="/digital-printing/car-sticker" className="hover:text-accent">Car Stickers</Link></li>
              <li><Link href="/digital-printing/notepad" className="hover:text-accent">Notepad</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold">Branding & Marketing</h4>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li><Link href="/digital-printing/brochure" className="hover:text-accent">Brochures</Link></li>
              <li><Link href="/digital-printing/flyers" className="hover:text-accent">Flyers</Link></li>
              <li><Link href="/digital-printing/certificate-printing" className="hover:text-accent">Certificates</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container-page grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-1 font-heading text-xl font-bold">
            <span>U</span>
            <span className="text-accent">GRAPHICS</span>
          </div>
          <p className="mt-3 text-sm text-white/70">
            Signboards, advertising & web design - helping businesses across
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
            <li><Link href="/signboards" className="hover:text-accent">Signboards</Link></li>
            <li><Link href="/digital-printing" className="hover:text-accent">Digital Printing</Link></li>
            <li><Link href="/services?group=web-design#web-design" className="hover:text-accent">Web Design & Digital</Link></li>
            <li><Link href="/portfolio" className="hover:text-accent">Our Projects</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold">Contact</h4>
          <LocationToggle
            indiaAddress={settings.indiaAddress}
            malaysiaAddress={settings.malaysiaAddress}
            malaysiaPhone={settings.malaysiaPhone}
            indiaPhone={
              settings.indiaPhone ||
              `+${(settings.whatsapp || siteConfig.whatsapp).replace(/^0+/, "")}`
            }
          />
          <div className="mt-3 flex items-center gap-2 text-sm text-white/70">
            <Mail size={16} /> <a href={`mailto:${settings.email}`} className="hover:text-accent">{settings.email}</a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <div className="container-page flex flex-col items-center justify-between gap-2 text-xs text-white/60 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} U Graphics. All rights reserved.</p>
          <Link href="/contact" className="hover:text-accent">Contact U Graphics</Link>
        </div>
      </div>
    </footer>
  );
}
