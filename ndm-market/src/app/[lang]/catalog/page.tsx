export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";

import CatalogFilters from "@/components/catalog/CatalogFilters";
import ProductCard from "@/components/cards/ProductCard";
import { getDictionary } from "@/i18n/dictionaries";
import {
  countProducts,
  getBrandsWithCount,
  getCategoriesWithCount,
  getProducts,
} from "@/lib/data/catalog";
import { isLocale } from "@/lib/i18n";

interface CatalogPageProps {
  params: { lang: string };
  searchParams: Record<string, string | string[] | undefined>;
}

const PAGE_SIZE = 12;

function normalizeParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

export default async function CatalogPage({ params, searchParams }: CatalogPageProps) {
  const locale = params.lang;

  if (!isLocale(locale)) {
    notFound();
  }

  const searchQuery = normalizeParam(searchParams.q);
  const categorySlug = normalizeParam(searchParams.category);
  const brandSlug = normalizeParam(searchParams.brand);
  const pageFromQuery = Number(normalizeParam(searchParams.page) ?? 1);
  const requestedPage = Number.isNaN(pageFromQuery) || pageFromQuery < 1 ? 1 : pageFromQuery;

  const [dictionary, categories, brands, totalProducts] = await Promise.all([
    getDictionary(locale),
    getCategoriesWithCount(),
    getBrandsWithCount(),
    countProducts({
      search: searchQuery,
      categorySlug: categorySlug || undefined,
      brandSlug: brandSlug || undefined,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const skip = (currentPage - 1) * PAGE_SIZE;

  const products = await getProducts({
    search: searchQuery,
    categorySlug: categorySlug || undefined,
    brandSlug: brandSlug || undefined,
    skip,
    take: PAGE_SIZE,
  });

  const buildPageHref = (page: number) => {
    const paramsUrl = new URLSearchParams();

    if (searchQuery) paramsUrl.set("q", searchQuery);
    if (categorySlug) paramsUrl.set("category", categorySlug);
    if (brandSlug) paramsUrl.set("brand", brandSlug);
    if (page > 1) paramsUrl.set("page", String(page));

    const queryString = paramsUrl.toString();
    return `/${locale}/catalog${queryString ? `?${queryString}` : ""}`;
  };

  return (
    <section className="mx-auto max-w-7xl space-y-10 px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <span className="text-xs uppercase tracking-[0.3em] text-muted">
          {dictionary.catalog.filtersTitle as string}
        </span>
        <h1 className="text-4xl font-semibold text-ink">
          {dictionary.catalog.title as string}
        </h1>
        <p className="max-w-2xl text-base text-muted">
          {dictionary.catalog.subtitle as string}
        </p>
      </div>

      <CatalogFilters
        locale={locale}
        dictionary={dictionary}
        categories={categories}
        brands={brands}
        initialQuery={{ q: searchQuery ?? undefined, category: categorySlug ?? undefined, brand: brandSlug ?? undefined }}
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">
          {dictionary.catalog.resultsLabel as string}: {totalProducts}
        </p>
        {totalPages > 1 ? (
          <div className="hidden gap-2 text-sm font-semibold text-muted md:flex">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <Link
                key={pageNumber}
                href={buildPageHref(pageNumber)}
                className={`rounded-full px-4 py-2 transition-colors ${
                  pageNumber === currentPage
                    ? "bg-primary text-white shadow"
                    : "hover:bg-subtle hover:text-ink"
                }`}
              >
                {pageNumber}
              </Link>
            ))}
          </div>
        ) : null}
      </div>

      {products.length ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              locale={locale}
              dictionary={dictionary}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-subtle/80 bg-subtle/30 p-12 text-center text-sm text-muted">
          {dictionary.catalog.emptyState as string}
        </div>
      )}

      {totalPages > 1 ? (
          <div className="flex items-center justify-between gap-4 border-t border-subtle/60 pt-6">
            <Link
              href={buildPageHref(Math.max(1, currentPage - 1))}
              aria-disabled={currentPage === 1}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                currentPage === 1
                  ? "cursor-not-allowed bg-subtle/60 text-muted"
                  : "border border-subtle/80 hover:border-primary hover:text-primary"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="h-4 w-4"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              <span>{dictionary.pagination?.prev as string}</span>
            </Link>
            <span className="text-sm text-muted">
              {currentPage} / {totalPages}
            </span>
            <Link
              href={buildPageHref(Math.min(totalPages, currentPage + 1))}
              aria-disabled={currentPage === totalPages}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                currentPage === totalPages
                  ? "cursor-not-allowed bg-subtle/60 text-muted"
                  : "border border-subtle/80 hover:border-primary hover:text-primary"
              }`}
            >
              <span>{dictionary.pagination?.next as string}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="h-4 w-4"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          </div>
      ) : null}
    </section>
  );
}
