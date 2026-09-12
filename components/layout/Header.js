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
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeMobileMenu();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);


  useEffect(() => {
    fetch("/api/categories").then((response) => response.ok ? response.json() : null).then((data) => setCategories(data?.categories || [])).catch(() => {});
    const loadCart = () => fetch("/api/cart").then((response) => response.ok ? response.json() : null).then((data) => setCartCount((data?.cart?.items || []).reduce((sum, item) => sum + item.quantity, 0))).catch(() => {});
    const changed = (event) => event.detail?.items ? setCartCount(event.detail.items.reduce((sum, item) => sum + item.quantity, 0)) : loadCart();
    loadCart(); window.addEventListener("cart-changed", changed); return () => window.removeEventListener("cart-changed", changed);
  }, []);
  const [customer, setCustomer] = useState(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const loadCustomer = () => fetch("/api/customer/session")
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => setCustomer(data?.customer || null))
    .catch(() => {});

  useEffect(() => {
    loadCustomer();
    window.addEventListener("customer-changed", loadCustomer);
    return () => window.removeEventListener("customer-changed", loadCustomer);
  }, []);

  const logout = async () => {
    await fetch("/api/customer/session", { method: "DELETE" });
    setCustomer(null);
    setAccountMenuOpen(false);
    window.location.href = "/";
  };

  const submitSearch = (event) => { event.preventDefault(); const term = search.trim(); if (term) window.location.href = `/products?q=${encodeURIComponent(term)}`; };

  return (
    <header className={`sticky top-0 z-50 w-full bg-white transition-shadow ${scrolled ? "shadow-md" : ""}`}>
      <div className={`mx-auto flex w-full max-w-[1600px] items-center justify-between px-4 transition-all sm:px-6 lg:px-8 ${scrolled ? "py-2" : "py-3"}`}>
        <Link href="/" className="flex shrink-0 items-center">
          <Image src="/images/ugraphics.png" alt="U Graphics" width={320} height={96} priority quality={100} className="h-9 w-auto sm:h-10" />
        </Link>

        <nav aria-label="Primary navigation" className="hidden min-w-0 flex-1 items-center justify-center gap-2.5 2xl:flex">
          {navLinks.slice(0, 3).map((link) => (
            <div key={link.href} className="group relative">
              <Link href={link.href} className="flex items-center gap-1 whitespace-nowrap font-body text-sm font-medium text-ink transition hover:text-primary">
                {link.label}
              </Link>
            </div>
          ))}
          <div className="relative" onMouseEnter={() => setDesktopMenu("All Categories")} onMouseLeave={() => setDesktopMenu("")}>
            <button type="button" onClick={() => setDesktopMenu(desktopMenu === "All Categories" ? "" : "All Categories")} className="flex items-center gap-1 whitespace-nowrap text-sm font-medium text-ink transition hover:text-primary" aria-expanded={desktopMenu === "All Categories"}>
              All Categories <ChevronDown size={14} />
            </button>
            {desktopMenu === "All Categories" && <div className="absolute left-0 top-full z-50 w-[min(48rem,calc(100vw-2rem))] pt-3"><div className="overflow-hidden rounded-card border border-ink/10 bg-white shadow-card"><div className="bg-primary px-5 py-4 text-white"><p className="font-heading text-base font-semibold">All Categories</p><p className="mt-1 text-xs text-white/75">Browse the U Graphics catalogue</p></div><div className="grid max-h-[55vh] grid-cols-3 gap-x-2 gap-y-1 overflow-y-auto p-4">{categories.map((item) => <Link key={item.slug} href={`/products/${item.slug}`} className="rounded px-3 py-2 text-xs leading-4 text-ink/75 hover:bg-surface-muted hover:text-primary" onClick={() => setDesktopMenu("")}>{item.name}</Link>)}</div></div></div>}
          </div>
          {catalogueMenus.map((menu) => { const items = categories.filter((category) => category.section === menu.section); return <div key={menu.href} className="relative" onMouseEnter={() => setDesktopMenu(menu.label)} onMouseLeave={() => setDesktopMenu("")} onFocus={() => setDesktopMenu(menu.label)}><Link href={menu.href} className="flex items-center gap-1 whitespace-nowrap font-body text-sm font-medium text-ink transition hover:text-primary" aria-expanded={desktopMenu === menu.label} aria-controls={`desktop-${menu.section}`}>{menu.label}<ChevronDown className={desktopMenu === menu.label ? "rotate-180" : ""} size={14} /></Link>{desktopMenu === menu.label && <div className="absolute left-1/2 top-full z-50 w-[min(48rem,calc(100vw-2rem))] -translate-x-1/2 pt-3"><div id={`desktop-${menu.section}`} className="overflow-hidden rounded-card border border-ink/10 bg-white shadow-card"><div className="bg-primary px-5 py-4 text-white"><p className="font-heading text-base font-semibold">{menu.label}</p><p className="mt-1 text-xs text-white/75">{menu.description}</p></div><div className="grid max-h-[55vh] grid-cols-3 gap-x-2 gap-y-1 overflow-y-auto p-4">{items.map((item) => <Link key={item.slug} href={`/products/${item.slug}`} className="rounded px-3 py-2 text-xs leading-4 text-ink/75 transition hover:bg-surface-muted hover:text-primary" onClick={() => setDesktopMenu("")}>{item.name}</Link>)}</div><Link href={menu.href} className="block border-t border-ink/10 px-5 py-3 text-sm font-semibold text-primary hover:bg-surface-muted" onClick={() => setDesktopMenu("")}>Explore all {menu.label}</Link></div></div>}</div>; })}
          {navLinks.slice(3).map((link) => <Link key={link.href} href={link.href} className="whitespace-nowrap text-sm font-medium text-ink transition hover:text-primary">{link.label}</Link>)}
        </nav>

        <div className="hidden shrink-0 items-center gap-2.5 2xl:flex">
          <form onSubmit={submitSearch} className="relative">
            <label className="sr-only" htmlFor="site-search">Search products</label>
            <input id="site-search" value={search} onChange={(event) => setSearch(event.target.value)} maxLength={80} placeholder="Search products" className="w-28 rounded border border-ink/15 py-2 pl-3 pr-8 text-sm xl:w-36" />
            <Search size={16} className="pointer-events-none absolute right-2 top-2.5 text-ink/50" />
          </form>
          <div className="relative" onMouseEnter={() => setAccountMenuOpen(true)} onMouseLeave={() => setAccountMenuOpen(false)}>
            {customer ? (
              <>
                <button className="flex items-center gap-1 text-primary" aria-label="Account menu">
                  <User size={20} />
                  <span className="max-w-[70px] truncate text-sm font-medium">{customer.name}</span>
                </button>
                {accountMenuOpen && (
                  <div className="absolute right-0 top-full w-44 rounded-card border border-ink/10 bg-white py-2 shadow-card">
                    <p className="border-b border-ink/5 px-4 pb-2 text-xs text-ink/50">{customer.email}</p>
                    <Link href="/orders" className="block px-4 py-2 text-sm text-ink hover:bg-surface-muted">My Orders</Link>
                    <Link href="/account/addresses" className="block px-4 py-2 text-sm text-ink hover:bg-surface-muted">Saved Addresses</Link>
                    <button onClick={logout} className="block w-full px-4 py-2 text-left text-sm text-danger hover:bg-red-50">Sign Out</button>
                  </div>
                )}
              </>
            ) : (
              <Link href="/account" aria-label="Login or create account" className="text-primary"><User size={20} /></Link>
            )}
          </div>
          <Link href="/cart" aria-label={`Cart, ${cartCount} items`} className="relative shrink-0 text-primary">
            <ShoppingCart size={21} />
            {cartCount > 0 && <span className="absolute -right-2 -top-2 rounded-full bg-accent px-1.5 text-[10px] text-white">{cartCount}</span>}
          </Link>
          <a href={`tel:${settings.indiaPhone || siteConfig.indiaPhone}`} className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-sm font-medium text-primary">
            <Phone size={16} /> Call Us
          </a>
          <Link href="/get-a-quote" className="btn-primary shrink-0 whitespace-nowrap px-4 py-2.5 text-sm">
            Get a Quote
          </Link>
        </div>

        <button className="rounded-lg p-2 text-primary transition hover:bg-primary/5 2xl:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen}>
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
        <div className="ml-auto flex items-center gap-1 2xl:hidden">
          <button className="rounded-lg p-2 text-primary transition hover:bg-primary/5" aria-label="Search products" onClick={() => setSearchOpen(!searchOpen)}><Search size={21} /></button>
          <Link href="/account" className="rounded-lg p-2 text-primary transition hover:bg-primary/5" aria-label={customer ? "My account" : "Login or create account"}><User size={21} /></Link>
          <Link href="/cart" className="relative rounded-lg p-2 text-primary transition hover:bg-primary/5" aria-label={`Cart, ${cartCount} items`}>
            <ShoppingCart size={21} />
            {cartCount > 0 && <span className="absolute right-0 top-0 min-w-4 rounded-full bg-accent px-1 text-center text-[10px] leading-4 text-white">{cartCount}</span>}
          </Link>
          <Link href="/get-a-quote" className="ml-1 hidden rounded-lg bg-accent px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-accent-dark sm:inline-flex">Quote</Link>
        </div>
      </div>

      {searchOpen && (
        <form onSubmit={submitSearch} className="border-t bg-white px-4 py-3 2xl:hidden">
          <label className="sr-only" htmlFor="mobile-search">Search products</label>
          <div className="container-page flex gap-2 px-0">
            <input id="mobile-search" autoFocus value={search} onChange={(event) => setSearch(event.target.value)} maxLength={80} placeholder="Search products" className="min-w-0 flex-1 rounded-lg border border-ink/20 px-3 py-2 text-sm" />
            <button className="rounded-lg bg-primary px-4 text-sm font-semibold text-white">Search</button>
          </div>
        </form>
      )}

      {mobileOpen && (
        <div className="absolute inset-x-0 top-full z-50 min-h-[calc(100vh-4rem)] border-t border-ink/10 bg-ink/30 2xl:hidden">
          <button type="button" className="absolute inset-0 h-[calc(100vh-4rem)] w-full cursor-default" aria-label="Close menu" onClick={closeMobileMenu} />
          <nav aria-label="Mobile navigation" className="relative ml-auto flex max-h-[calc(100vh-4rem)] w-full max-w-md flex-col gap-1 overflow-y-auto bg-white px-5 py-4 shadow-2xl sm:px-6">
            <div className="mb-2 flex items-center justify-between border-b border-ink/10 pb-3">
              <p className="font-heading text-base font-bold text-primary">Menu</p>
              <button type="button" onClick={closeMobileMenu} className="rounded-lg p-2 text-ink hover:bg-surface-muted" aria-label="Close menu"><X size={20} /></button>
            </div>
            {navLinks.map((link) => (
              <div key={link.href}>
                <Link href={link.href} className="block py-2 font-medium text-ink" onClick={closeMobileMenu}>
                  {link.label}
                </Link>
              </div>
            ))}
            <Link href="/cart" className="py-2 font-medium text-ink" onClick={closeMobileMenu}>Cart ({cartCount})</Link>

            {customer ? (
              <div className="border-t border-ink/5">
                <button type="button" className="flex w-full items-center justify-between py-3 font-medium text-ink" aria-expanded={expandedMenu === "Account"} onClick={() => setExpandedMenu(expandedMenu === "Account" ? "" : "Account")}>
                  <span className="flex items-center gap-2"><User size={18} /> {customer.name}</span>
                  <ChevronDown className={expandedMenu === "Account" ? "rotate-180" : ""} size={18} />
                </button>
                {expandedMenu === "Account" && (
                  <div className="mb-3 grid gap-1 border-l border-primary/20 pl-3">
                    <p className="py-1 text-xs text-ink/50">{customer.email}</p>
                    <Link href="/orders" className="py-2 text-sm text-ink/75" onClick={closeMobileMenu}>My Orders</Link>
                    <Link href="/account/addresses" className="py-2 text-sm text-ink/75" onClick={closeMobileMenu}>Saved Addresses</Link>
                    <button onClick={() => { logout(); closeMobileMenu(); }} className="py-2 text-left text-sm text-danger">Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/account" className="py-2 font-medium text-ink" onClick={closeMobileMenu}>Login / Register</Link>
            )}

            <div className="border-t border-ink/5">
              <button type="button" className="flex w-full items-center justify-between py-3 font-medium text-ink" aria-expanded={expandedMenu === "All Categories"} onClick={() => setExpandedMenu(expandedMenu === "All Categories" ? "" : "All Categories")}>
                All Categories <ChevronDown className={expandedMenu === "All Categories" ? "rotate-180" : ""} size={18} />
              </button>
              {expandedMenu === "All Categories" && <div className="mb-3 grid max-h-64 gap-1 overflow-y-auto border-l border-primary/20 pl-3">{categories.map((item) => <Link key={item.slug} href={`/products/${item.slug}`} className="py-2 text-sm leading-5 text-ink/75" onClick={closeMobileMenu}>{item.name}</Link>)}</div>}
            </div>
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
