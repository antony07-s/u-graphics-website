"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, Phone, ChevronDown, Search, ShoppingCart, User } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";
import { useSiteSettings } from "@/components/providers/useSiteSettings";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact", href: "/contact" },
];

const catalogueMenus = [
  { label: "Signboards", href: "/signboards", section: "signboards", description: "3D letters, LED, wayfinding and display signage" },
  { label: "Digital Printing", href: "/digital-printing", section: "digital-printing", description: "Print, stickers, banners and promotional materials" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState("");
  const [desktopMenu, setDesktopMenu] = useState("");
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
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
    fetch("/api/categories").then((response) => response.ok ? response.json() : null).then((data) => setCategories(data?.categories || [])).catch(() => {});
    const loadCart = () => fetch("/api/cart").then((response) => response.ok ? response.json() : null).then((data) => setCartCount((data?.cart?.items || []).reduce((sum, item) => sum + item.quantity, 0))).catch(() => {});
    const changed = (event) => event.detail?.items ? setCartCount(event.detail.items.reduce((sum, item) => sum + item.quantity, 0)) : loadCart();
    loadCart(); window.addEventListener("cart-changed", changed); return () => window.removeEventListener("cart-changed", changed);
  }, []);
  const submitSearch = (event) => { event.preventDefault(); const term = search.trim(); if (term) window.location.href = `/products?q=${encodeURIComponent(term)}`; };

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
        <nav aria-label="Primary navigation" className="hidden items-center gap-4 xl:gap-5 lg:flex">
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
          {catalogueMenus.map((menu) => { const items = categories.filter((category) => category.section === menu.section); return <div key={menu.href} className="relative" onMouseEnter={() => setDesktopMenu(menu.label)} onMouseLeave={() => setDesktopMenu("")} onFocus={() => setDesktopMenu(menu.label)}><Link href={menu.href} className="flex items-center gap-1 whitespace-nowrap font-body text-sm font-medium text-ink transition hover:text-primary" aria-expanded={desktopMenu === menu.label} aria-controls={`desktop-${menu.section}`}>{menu.label}<ChevronDown className={desktopMenu === menu.label ? "rotate-180" : ""} size={14} /></Link>{desktopMenu === menu.label && <div className="absolute left-1/2 top-full z-50 w-[min(48rem,calc(100vw-2rem))] -translate-x-1/2 pt-3"><div id={`desktop-${menu.section}`} className="overflow-hidden rounded-card border border-ink/10 bg-white shadow-card"><div className="bg-primary px-5 py-4 text-white"><p className="font-heading text-base font-semibold">{menu.label}</p><p className="mt-1 text-xs text-white/75">{menu.description}</p></div><div className="grid max-h-[55vh] grid-cols-3 gap-x-2 gap-y-1 overflow-y-auto p-4">{items.map((item) => <Link key={item.slug} href={`/products/${item.slug}`} className="rounded px-3 py-2 text-xs leading-4 text-ink/75 transition hover:bg-surface-muted hover:text-primary" onClick={() => setDesktopMenu("")}>{item.name}</Link>)}</div><Link href={menu.href} className="block border-t border-ink/10 px-5 py-3 text-sm font-semibold text-primary hover:bg-surface-muted" onClick={() => setDesktopMenu("")}>Explore all {menu.label} →</Link></div></div>}</div>; })}
          {navLinks.slice(3).map((link) => <Link key={link.href} href={link.href} className="text-sm font-medium text-ink transition hover:text-primary">{link.label}</Link>)}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          <form onSubmit={submitSearch} className="relative"><label className="sr-only" htmlFor="site-search">Search products</label><input id="site-search" value={search} onChange={(event) => setSearch(event.target.value)} maxLength={80} placeholder="Search products" className="w-32 rounded border border-ink/15 py-2 pl-3 pr-8 text-sm xl:w-40" /><Search size={16} className="pointer-events-none absolute right-2 top-2.5 text-ink/50" /></form>
          <Link href="/account" aria-label="Customer account" className="text-primary"><User size={20} /></Link><Link href="/cart" aria-label={`Cart, ${cartCount} items`} className="relative text-primary"><ShoppingCart size={21} />{cartCount > 0 && <span className="absolute -right-2 -top-2 rounded-full bg-accent px-1.5 text-[10px] text-white">{cartCount}</span>}</Link>
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
        <button className="ml-auto mr-3 text-primary lg:hidden" aria-label="Search products" onClick={() => setSearchOpen(!searchOpen)}><Search size={22} /></button><Link href="/cart" className="relative mr-3 text-primary lg:hidden" aria-label="Cart"><ShoppingCart size={22} />{cartCount > 0 && <span className="absolute -right-2 -top-2 rounded-full bg-accent px-1 text-[10px] text-white">{cartCount}</span>}</Link>
      </div>
      {searchOpen && <form onSubmit={submitSearch} className="border-t bg-white px-4 py-3 lg:hidden"><label className="sr-only" htmlFor="mobile-search">Search products</label><input id="mobile-search" autoFocus value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" className="w-full rounded border border-ink/20 px-3 py-2" /></form>}

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
            <Link href="/cart" className="py-2 font-medium text-ink" onClick={closeMobileMenu}>Cart ({cartCount})</Link><Link href="/account" className="py-2 font-medium text-ink" onClick={closeMobileMenu}>Account</Link>
            {catalogueMenus.map((menu) => { const items = categories.filter((category) => category.section === menu.section); return <div key={menu.href} className="border-t border-ink/5"><button type="button" className="flex w-full items-center justify-between py-3 font-medium text-ink" aria-expanded={expandedMenu === menu.label} onClick={() => setExpandedMenu(expandedMenu === menu.label ? "" : menu.label)}><span>{menu.label}</span><ChevronDown className={expandedMenu === menu.label ? "rotate-180" : ""} size={18} /></button>{expandedMenu === menu.label && <div className="mb-3 grid gap-1 border-l border-primary/20 pl-3"><Link href={menu.href} className="py-2 text-sm font-medium text-primary" onClick={closeMobileMenu}>Explore all {menu.label}</Link>{items.map((item) => <Link key={item.slug} href={`/products/${item.slug}`} className="py-2 text-sm leading-5 text-ink/75" onClick={closeMobileMenu}>{item.name}</Link>)}</div>}</div>; })}
            <Link href="/get-a-quote" className="btn-primary mt-2 w-full" onClick={closeMobileMenu}>
              Get a Quote
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
