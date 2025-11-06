import Image from "next/image";
import Link from "next/link";

import type { Dictionary } from "@/i18n/dictionaries";
import type { ProductWithRelations } from "@/lib/data/catalog";
import type { Locale } from "@/lib/i18n";
import { pickLocalizedAlt, pickLocalizedDescription, pickLocalizedName } from "@/lib/utils";

interface ProductCardProps {
  product: ProductWithRelations;
  locale: Locale;
  dictionary: Dictionary;
}

export default function ProductCard({ product, locale, dictionary }: ProductCardProps) {
  const thumbnail = product.images[0];
  const categoryLabel = pickLocalizedName(product.category, locale);
  const brandLabel = product.brand ? pickLocalizedName(product.brand, locale) : null;
  const title = pickLocalizedName(product, locale);
  const excerpt = pickLocalizedDescription(product, locale);

  return (
    <Link
      href={`/${locale}/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-subtle/60 bg-surface shadow-sm transition-transform hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-subtle">
        {thumbnail ? (
          <Image
            src={thumbnail.url}
            alt={pickLocalizedAlt(thumbnail, locale) ?? title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 25vw, 300px"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            {dictionary.product.galleryLabel as string}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 px-6 pb-6 pt-5">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-muted">
          <span>{categoryLabel}</span>
          {brandLabel ? <span className="h-1 w-1 rounded-full bg-muted/40" /> : null}
          {brandLabel ? <span>{brandLabel}</span> : null}
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-ink transition-colors group-hover:text-primary">
            {title}
          </h3>
          {excerpt ? (
            <p className="line-clamp-3 text-sm text-muted">{excerpt}</p>
          ) : null}
        </div>
        <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-primary">
          {dictionary.buttons?.viewDetails as string}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
          >
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
