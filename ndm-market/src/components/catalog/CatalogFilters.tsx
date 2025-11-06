"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/lib/i18n";

interface CatalogFiltersProps {
  locale: Locale;
  dictionary: Dictionary;
  categories: Array<{
    id: number;
    nameUz: string;
    nameRu: string;
    slug: string;
  }>;
  brands: Array<{
    id: number;
    nameUz: string;
    nameRu: string;
    slug: string;
  }>;
  initialQuery: {
    q?: string;
    category?: string;
    brand?: string;
  };
}

export default function CatalogFilters({
  locale,
  dictionary,
  categories,
  brands,
  initialQuery,
}: CatalogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(initialQuery.q ?? "");

  const localizedCategories = useMemo(
    () =>
      categories.map((category) => ({
        slug: category.slug,
        label: locale === "uz" ? category.nameUz : category.nameRu,
      })),
    [categories, locale]
  );

  const localizedBrands = useMemo(
    () =>
      brands.map((brand) => ({
        slug: brand.slug,
        label: locale === "uz" ? brand.nameUz : brand.nameRu,
      })),
    [brands, locale]
  );

  const updateQuery = (updates: Record<string, string | null | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    params.delete("page");

    const queryString = params.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateQuery({ q: searchValue || undefined });
  };

  const handleReset = () => {
    setSearchValue("");
    updateQuery({ q: null, category: null, brand: null });
  };

  return (
    <div className="rounded-[var(--radius-lg)] border border-subtle/60 bg-surface p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-4">
        <form onSubmit={handleSubmit} className="flex flex-1 min-w-[220px] items-center gap-3">
          <div className="flex w-full items-center gap-2 rounded-full bg-subtle/60 px-4 py-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="h-5 w-5 text-primary"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder={dictionary.catalog.searchPlaceholder as string}
              className="w-full border-none bg-transparent text-sm font-medium text-ink outline-none placeholder:text-muted"
            />
          </div>
          <button
            type="submit"
            className="hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-strong sm:inline-flex"
          >
            {dictionary.buttons.search as string}
          </button>
        </form>

        <div className="flex flex-1 flex-wrap items-center gap-3">
          <select
            value={initialQuery.category ?? ""}
            onChange={(event) => updateQuery({ category: event.target.value || null })}
            className="min-w-[180px] flex-1 rounded-full border border-subtle/80 bg-surface px-4 py-2 text-sm font-semibold text-ink"
          >
            <option value="">
              {dictionary.filters.showAll as string} ({dictionary.catalog.categoryLabel as string})
            </option>
            {localizedCategories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.label}
              </option>
            ))}
          </select>

          <select
            value={initialQuery.brand ?? ""}
            onChange={(event) => updateQuery({ brand: event.target.value || null })}
            className="min-w-[180px] flex-1 rounded-full border border-subtle/80 bg-surface px-4 py-2 text-sm font-semibold text-ink"
          >
            <option value="">
              {dictionary.filters.showAll as string} ({dictionary.catalog.brandLabel as string})
            </option>
            {localizedBrands.map((brand) => (
              <option key={brand.slug} value={brand.slug}>
                {brand.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-full border border-subtle/80 px-4 py-2 text-sm font-semibold text-muted transition-colors hover:border-primary hover:text-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="h-4 w-4"
            >
              <path d="M3 12a9 9 0 0 1 15-6.708" />
              <path d="M21 12a9 9 0 0 1-15 6.708" />
              <path d="M3 3v6h6" />
              <path d="M21 21v-6h-6" />
            </svg>
            {dictionary.catalog.resetFilters as string}
          </button>
        </div>
      </div>
    </div>
  );
}
