import Image from "next/image";
import Link from "next/link";

import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/lib/i18n";
import { pickLocalizedName } from "@/lib/utils";

interface BrandWithCount {
  id: number;
  slug: string;
  nameUz: string;
  nameRu: string;
  logoUrl?: string | null;
  activeProductCount: number;
}

interface BrandCardProps {
  brand: BrandWithCount;
  locale: Locale;
  dictionary: Dictionary;
}

export default function BrandCard({ brand, locale, dictionary }: BrandCardProps) {
  const title = pickLocalizedName(brand, locale);

  return (
    <Link
      href={`/${locale}/catalog?brand=${brand.slug}`}
      className="group flex h-full flex-col justify-between rounded-[var(--radius-lg)] border border-subtle/60 bg-surface p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-subtle">
          {brand.logoUrl ? (
            <Image
              src={brand.logoUrl}
              alt={title}
              fill
              sizes="64px"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-muted">
              {title.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">{dictionary.navigation.brands as string}</p>
          <h3 className="text-xl font-semibold text-ink transition-colors group-hover:text-primary">
            {title}
          </h3>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between text-sm text-muted">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {dictionary.brands.productCount as string}
        </span>
        <span className="text-lg font-semibold text-ink">{brand.activeProductCount}</span>
      </div>
    </Link>
  );
}
