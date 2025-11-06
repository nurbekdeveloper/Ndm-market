import Link from "next/link";

import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/lib/i18n";
import { formatRightsTemplate } from "@/lib/utils";

interface SiteFooterProps {
  locale: Locale;
  dictionary: Dictionary;
}

export default function SiteFooter({ locale, dictionary }: SiteFooterProps) {
  const { footer, navigation, buttons } = dictionary;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-ink text-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="space-y-4">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-subtle">
              NDM Market
            </span>
            <h3 className="mt-2 text-2xl font-semibold">{footer.tagline as string}</h3>
          </div>
          <p className="max-w-md text-sm text-subtle/80">{footer.address as string}</p>
          <div className="space-y-1 text-sm text-subtle/80">
            <p>{footer.phone as string}</p>
            <p>{footer.email as string}</p>
            <p>{footer.telegram as string}</p>
          </div>
        </div>

        <div className="grid gap-4 text-sm">
          <h4 className="text-sm font-semibold tracking-wide text-subtle">
            {navigation.catalog as string}
          </h4>
          <div className="grid gap-2 text-subtle/80">
            <Link href={`/${locale}/categories`} className="transition-colors hover:text-surface">
              {navigation.categories as string}
            </Link>
            <Link href={`/${locale}/catalog`} className="transition-colors hover:text-surface">
              {navigation.catalog as string}
            </Link>
            <Link href={`/${locale}/brands`} className="transition-colors hover:text-surface">
              {navigation.brands as string}
            </Link>
            <Link href={`/${locale}/contact`} className="transition-colors hover:text-surface">
              {navigation.contact as string}
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-semibold tracking-wide text-subtle">
            {navigation.contact as string}
          </h4>
          <p className="text-sm text-subtle/80">
            {dictionary.contact?.subtitle as string}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-transform hover:-translate-y-0.5"
          >
            {buttons.contactUs as string}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4"
            >
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-subtle/70 sm:flex-row sm:px-6 lg:px-8">
          <p>{formatRightsTemplate(footer.rights as string, currentYear)}</p>
          <Link href={`/${locale}/admin`} className="transition-colors hover:text-surface">
            {navigation.admin as string}
          </Link>
        </div>
      </div>
    </footer>
  );
}
