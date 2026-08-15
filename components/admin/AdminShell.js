"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  FolderKanban,
  Layers,
  Newspaper,
  Mail,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Portfolio", href: "/admin/portfolio", icon: FolderKanban },
  { label: "Services", href: "/admin/services", icon: Layers },
  { label: "Blog", href: "/admin/blog", icon: Newspaper },
  { label: "Enquiries", href: "/admin/enquiries", icon: Mail },
  { label: "Site Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Login page renders standalone, no sidebar/topbar.
  if (pathname === "/admin/login") {
    return children;
  }

  return (
    <div className="flex min-h-screen bg-surface-muted">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-black/5 bg-white sm:flex">
        <div className="flex h-16 items-center border-b border-black/5 px-6">
          <span className="font-heading text-lg font-bold text-primary">
            U Graphics
          </span>
          <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
            Admin
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-4">
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
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-black/5 bg-white px-6">
          <p className="text-sm text-ink/60">
            Signed in as{" "}
            <span className="font-medium text-ink">
              {session?.user?.email || "..."}
            </span>
          </p>
          <Link
            href="/"
            target="_blank"
            className="text-sm font-medium text-primary hover:underline"
          >
            View Site ↗
          </Link>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
