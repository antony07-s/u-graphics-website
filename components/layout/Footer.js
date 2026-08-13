import Link from "next/link";
import { Facebook, Instagram, Youtube, MapPin, Mail, Phone } from "lucide-react";

export default function Footer() {
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
          <div className="mt-4 flex gap-3">
            <a href="#" aria-label="Facebook" className="rounded-full bg-white/10 p-2 hover:bg-accent">
              <Facebook size={16} />
            </a>
            <a href="#" aria-label="Instagram" className="rounded-full bg-white/10 p-2 hover:bg-accent">
              <Instagram size={16} />
            </a>
            <a href="#" aria-label="YouTube" className="rounded-full bg-white/10 p-2 hover:bg-accent">
              <Youtube size={16} />
            </a>
          </div>
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
              <span>Your Address, City, State, India - PIN</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> <span>+91 XXXXX XXXXX</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} /> <span>info@ugraphics.in</span>
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
