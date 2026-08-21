"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { signboards, digitalPrinting } from "@/lib/serviceCatalog";
import { siteConfig } from "@/lib/siteConfig";
import { useSiteSettings } from "@/components/providers/useSiteSettings";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact", href: "/contact" },
];

const defaultServiceMenus = [
  { label: "Signboards", href: "/signboards", items: signboards },
  { label: "Digital Printing", href: "/digital-printing", items: digitalPrinting },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState("");
  const [desktopMenu, setDesktopMenu] = useState("");
  const [serviceMenus, setServiceMenus] = useState(defaultServiceMenus);
  const settings = useSiteSettings();
  const closeMobileMenu = () => {
    setMobileOpen(false);
    setExpandedMenu("");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const merge = (defaults, managed = []) => {
      const bySlug = new Map(managed.map((item) => [item.slug, item]));
      return [...defaults.map((item) => ({ ...item, ...(bySlug.get(item.slug) || {}) })), ...managed.filter((item) => !defaults.some((base) => base.slug === item.slug))];
    };
    Promise.all([fetch("/api/services?catalogGroup=signboards"), fetch("/api/services?catalogGroup=digital-printing")])
      .then(async ([signboardResponse, printingResponse]) => {
        if (!signboardResponse.ok || !printingResponse.ok) return;
        const [signboardData, printingData] = await Promise.all([signboardResponse.json(), printingResponse.json()]);
        setServiceMenus([
          { ...defaultServiceMenus[0], items: merge(signboards, signboardData.services) },
          { ...defaultServiceMenus[1], items: merge(digitalPrinting, printingData.services) },
        ]);
      })
      .catch(() => {});
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
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/ugraphics.png"
            alt="U Graphics"
            width={320}
            height={96}
            priority
            quality={100}
            className="h-10 w-auto sm:h-11"
          />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary navigation" className="hidden items-center gap-4 xl:gap-6 lg:flex">
          {navLinks.slice(0, 3).map((link) => (
            <div key={link.href} className="group relative">
              <Link
                href={link.href}
                className="flex items-center gap-1 font-body text-sm font-medium text-ink transition hover:text-primary"
              >
                {link.label}
              </Link>
            </div>
          ))}
          {serviceMenus.map((menu) => <div key={menu.href} className="relative" onMouseEnter={() => setDesktopMenu(menu.label)} onMouseLeave={() => setDesktopMenu("")} onFocus={() => setDesktopMenu(menu.label)}><Link href={menu.href} className="flex items-center gap-1 whitespace-nowrap font-body text-sm font-medium text-ink transition hover:text-primary" aria-expanded={desktopMenu === menu.label} aria-controls={`desktop-${menu.label.toLowerCase().replace(/\s/g, "-")}`}>{menu.label}<ChevronDown className={desktopMenu === menu.label ? "rotate-180" : ""} size={14} /></Link>{desktopMenu === menu.label && <div className="absolute left-1/2 top-full z-50 w-[min(42rem,calc(100vw-2rem))] -translate-x-1/2 pt-3"><div id={`desktop-${menu.label.toLowerCase().replace(/\s/g, "-")}`} className="rounded-card border border-ink/10 bg-white p-4 shadow-card"><Link href={menu.href} className="mb-3 block border-b border-ink/10 pb-3 font-heading text-sm font-semibold text-primary" onClick={() => setDesktopMenu("")}>View all {menu.label}</Link><div className="grid grid-cols-2 gap-x-3 gap-y-1">{menu.items.map((item) => <Link key={item.slug} href={`${menu.href}/${item.slug}`} className="px-2 py-2 text-left text-xs leading-4 text-ink/75 transition hover:text-primary" onClick={() => setDesktopMenu("")}>{item.title}</Link>)}</div></div></div>}</div>)}
          {navLinks.slice(3).map((link) => <Link key={link.href} href={link.href} className="text-sm font-medium text-ink transition hover:text-primary">{link.label}</Link>)}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${settings.indiaPhone || siteConfig.indiaPhone}`}
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
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t bg-white lg:hidden">
          <nav className="container-page flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  className="block py-2 font-medium text-ink"
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </Link>
              </div>
            ))}
            {serviceMenus.map((menu) => <div key={menu.href} className="border-t border-ink/5"><button type="button" className="flex w-full items-center justify-between py-3 font-medium text-ink" aria-expanded={expandedMenu === menu.label} onClick={() => setExpandedMenu(expandedMenu === menu.label ? "" : menu.label)}><span>{menu.label}</span><ChevronDown className={expandedMenu === menu.label ? "rotate-180" : ""} size={18} /></button>{expandedMenu === menu.label && <div className="mb-3 grid gap-1 border-l border-primary/20 pl-3"><Link href={menu.href} className="py-2 text-sm font-medium text-primary" onClick={closeMobileMenu}>View all {menu.label}</Link>{menu.items.map((item) => <Link key={item.slug} href={`${menu.href}/${item.slug}`} className="py-2 text-sm leading-5 text-ink/75" onClick={closeMobileMenu}>{item.title}</Link>)}</div>}</div>)}
            <Link href="/get-a-quote" className="btn-primary mt-2 w-full" onClick={closeMobileMenu}>
              Get a Quote
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
