"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import type { Locale } from "@/lib/i18n";

interface LanguageSwitcherProps {
  currentLocale: Locale;
  availableLocales: Locale[];
}

function buildHref(pathname: string, targetLocale: Locale) {
  const segments = pathname.split("/").filter(Boolean);

  if (!segments.length) {
    return `/${targetLocale}`;
  }

  segments[0] = targetLocale;
  return `/${segments.join("/")}`;
}

export default function LanguageSwitcher({
  currentLocale,
  availableLocales,
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!pathname) {
    return null;
  }

  const queryString = searchParams.toString();

  return (
    <div className="flex items-center gap-1 rounded-full bg-subtle/60 px-1 py-1 text-sm font-medium text-muted">
      {availableLocales.map((locale) => {
        const isActive = locale === currentLocale;
        const baseHref = buildHref(pathname, locale);
        const href = queryString ? `${baseHref}?${queryString}` : baseHref;

        return (
          <Link
            key={locale}
            href={href}
            className={`rounded-full px-3 py-1 transition-colors ${
              isActive
                ? "bg-surface text-ink shadow-sm"
                : "text-muted hover:text-ink"
            }`}
            prefetch={false}
          >
            {locale.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
