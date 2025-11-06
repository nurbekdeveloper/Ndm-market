import Link from "next/link";

import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/lib/i18n";

import LanguageSwitcher from "./LanguageSwitcher";
import HeaderSearch from "../search/HeaderSearch";

interface SiteHeaderProps {
  locale: Locale;
  dictionary: Dictionary;
  languageOrder: Locale[];
}

const buildNavigation = (locale: Locale, dictionary: Dictionary) => {
  const { navigation } = dictionary;

  return [
    { key: "home", label: navigation.home, href: `/${locale}` },
    { key: "categories", label: navigation.categories, href: `/${locale}/categories` },
    { key: "catalog", label: navigation.catalog, href: `/${locale}/catalog` },
    { key: "brands", label: navigation.brands, href: `/${locale}/brands` },
    { key: "contact", label: navigation.contact, href: `/${locale}/contact` },
  ];
};

export default function SiteHeader({
  locale,
  dictionary,
  languageOrder,
}: SiteHeaderProps) {
  const navigationItems = buildNavigation(locale, dictionary);

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href={`/${locale}`} className="group flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-white shadow-lg shadow-primary/20">
            N
          </div>
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-[0.3em] text-muted transition-colors group-hover:text-ink">
              NDM Market
            </span>
            <span className="text-lg font-semibold text-ink">
              Construction Materials
            </span>
          </div>
        </Link>

        <nav className="order-last flex w-full justify-between gap-2 overflow-x-auto rounded-full bg-subtle/40 px-2 py-2 text-sm font-medium text-muted shadow-inner md:order-none md:w-auto md:flex-1 md:justify-center">
          {navigationItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="rounded-full px-4 py-2 transition-colors hover:bg-surface hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <HeaderSearch
            locale={locale}
            placeholder={dictionary.navigation.searchPlaceholder as string}
          />
          <Link
            href={`/${locale}/catalog`}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-subtle text-primary shadow-inner lg:hidden"
            aria-label={dictionary.navigation.searchPlaceholder as string}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="h-5 w-5"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </Link>
          <LanguageSwitcher currentLocale={locale} availableLocales={languageOrder} />
        </div>
      </div>
    </header>
  );
}
