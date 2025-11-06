import Image from "next/image";
import Link from "next/link";

import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/lib/i18n";
import { pickLocalizedDescription, pickLocalizedName } from "@/lib/utils";

interface CategoryWithCount {
  id: number;
  slug: string;
  nameUz: string;
  nameRu: string;
  descriptionUz?: string | null;
  descriptionRu?: string | null;
  imageUrl?: string | null;
  activeProductCount: number;
}

interface CategoryCardProps {
  category: CategoryWithCount;
  locale: Locale;
  dictionary: Dictionary;
}

export default function CategoryCard({ category, locale, dictionary }: CategoryCardProps) {
  const title = pickLocalizedName(category, locale);
  const description = pickLocalizedDescription(category, locale);

  return (
    <Link
      href={`/${locale}/catalog?category=${category.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-subtle/60 bg-surface shadow-sm transition-transform hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-subtle">
        {category.imageUrl ? (
          <Image
            src={category.imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 25vw, 300px"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            {dictionary.categories.exploreCta as string}
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-surface/90 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary shadow">
          {dictionary.navigation.categories as string}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 px-6 pb-6 pt-5">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-muted">
          <span>{title}</span>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
            {category.activeProductCount}+
          </span>
        </div>
        {description ? <p className="text-sm text-muted">{description}</p> : null}
        <div className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary">
          {dictionary.categories.exploreCta as string}
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
