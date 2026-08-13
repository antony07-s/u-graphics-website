"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Signage & Advertising", href: "/services#signage" },
      { label: "Web Design & Digital", href: "/services#web-design" },
    ],
  },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white transition-shadow ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div
        className={`container-page flex items-center justify-between transition-all ${
          scrolled ? "py-2" : "py-4"
        }`}
      >
        {/* Placeholder logo */}
        <Link href="/" className="flex items-center gap-1 font-heading text-2xl font-bold">
          <span className="text-primary">U</span>
          <span className="text-ink">GRAPHICS</span>
          <span className="ml-1 h-2 w-2 rounded-full bg-accent" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <div key={link.href} className="group relative">
              <Link
                href={link.href}
                className="flex items-center gap-1 font-body text-sm font-medium text-ink transition hover:text-primary"
              >
                {link.label}
                {link.children && <ChevronDown size={14} />}
              </Link>
              {link.children && (
                <div className="invisible absolute left-0 top-full w-64 rounded-card bg-white opacity-0 shadow-card transition group-hover:visible group-hover:opacity-100">
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-4 py-3 text-sm text-ink transition hover:bg-surface-muted hover:text-primary"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="tel:+91XXXXXXXXXX"
            className="flex items-center gap-2 text-sm font-medium text-primary"
          >
            <Phone size={16} /> Call Us
          </a>
          <Link href="/get-a-quote" className="btn-primary text-sm">
            Get a Quote
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t bg-white lg:hidden">
          <nav className="container-page flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  className="block py-2 font-medium text-ink"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="ml-4 flex flex-col gap-1 border-l pl-3">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="py-1 text-sm text-ink/70"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link href="/get-a-quote" className="btn-primary mt-2 w-full">
              Get a Quote
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
