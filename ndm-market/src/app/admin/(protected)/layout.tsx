import { ReactNode } from "react";

import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

interface AdminLayoutProps {
  children: ReactNode;
}

const navigation = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/brands", label: "Brands" },
  { href: "/admin/banners", label: "Banners" },
  { href: "/admin/settings", label: "Language" },
];

export default async function AdminProtectedLayout({ children }: AdminLayoutProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-subtle/40">
      <aside className="hidden w-64 shrink-0 flex-col gap-6 border-r border-subtle/60 bg-surface px-6 py-8 shadow-lg shadow-primary/5 lg:flex">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-white">
            N
          </div>
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-[0.3em] text-muted">
              NDM Market
            </span>
            <span className="text-base font-semibold text-ink">Admin Studio</span>
          </div>
        </Link>

        <nav className="flex flex-col gap-2 text-sm font-semibold text-muted">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-4 py-3 transition-colors hover:bg-primary/10 hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form action="/api/auth/signout" method="post" className="mt-auto">
          <button
            type="submit"
            className="w-full rounded-full border border-subtle/80 px-4 py-2 text-sm font-semibold text-muted transition-colors hover:border-primary hover:text-primary"
          >
            Sign out
          </button>
        </form>
      </aside>

      <main className="flex-1">
        <header className="sticky top-0 z-30 border-b border-subtle/60 bg-surface/90 p-4 backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted">
              Signed in as <span className="text-ink">{session.user?.name}</span>
            </span>
            <div className="lg:hidden">
              <Link
                href="/admin/dashboard"
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
              >
                Menu
              </Link>
            </div>
          </div>
        </header>
        <div className="p-6 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
