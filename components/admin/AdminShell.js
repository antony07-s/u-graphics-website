"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  FolderKanban,
  Package,
  Layers,
  Newspaper,
  Mail,
  Settings,
  ClipboardList,
  Star,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Portfolio", href: "/admin/portfolio", icon: FolderKanban },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ClipboardList },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Services", href: "/admin/services", icon: Layers },
  { label: "Blog", href: "/admin/blog", icon: Newspaper },
  { label: "Enquiries", href: "/admin/enquiries", icon: Mail },
  { label: "Site Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { setMenuOpen(false); }, [pathname]);
  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = (event) => { if (event.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", closeOnEscape); document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Login page renders standalone, no sidebar/topbar.
  if (pathname === "/admin/login") {
    return children;
  }

  return (
    <div className="flex min-h-screen bg-surface-muted">
      {menuOpen && <button type="button" aria-label="Close navigation menu" onClick={() => setMenuOpen(false)} className="fixed inset-0 z-40 bg-ink/35 md:hidden" />}
      {/* Sidebar: fixed drawer on mobile, persistent rail on desktop. */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-black/5 bg-white shadow-2xl transition-transform duration-200 ease-out md:static md:w-60 md:max-w-none md:translate-x-0 md:shadow-none ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="hidden h-16 items-center border-b border-black/5 px-6 md:flex">
          <span className="font-heading text-lg font-bold text-primary">
            U Graphics
          </span>
          <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
            Admin
          </span>
        </div>

        <div className="flex h-16 items-center justify-between border-b border-black/5 px-6 md:hidden"><span className="font-heading text-lg font-bold text-primary">U Graphics <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold">Admin</span></span><button type="button" onClick={() => setMenuOpen(false)} className="rounded-lg p-2 text-ink/60 hover:bg-surface-muted" aria-label="Close navigation menu"><X size={20} /></button></div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto overscroll-contain p-4">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-card px-4 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-primary text-white"
                    : "text-ink/70 hover:bg-surface-muted"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-black/5 p-4">
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex w-full items-center gap-3 rounded-card px-4 py-2.5 text-sm font-medium text-danger hover:bg-red-50"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-w-0 flex flex-1 flex-col">
        <header className="flex min-h-16 items-center justify-between gap-3 border-b border-black/5 bg-white px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2"><button type="button" onClick={() => setMenuOpen(true)} className="-ml-2 rounded-lg p-2 text-primary hover:bg-primary/5 md:hidden" aria-label="Open navigation menu" aria-expanded={menuOpen}><Menu size={22} /></button><p className="truncate text-sm text-ink/60">
            Signed in as{" "}
            <span className="font-medium text-ink">
              {session?.user?.email || "..."}
            </span>
          </p></div>
          <Link
            href="/"
            target="_blank"
            className="text-sm font-medium text-primary hover:underline"
          >
            View Site ↗
          </Link>
        </header>
        <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}


