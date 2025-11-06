export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductCard from "@/components/cards/ProductCard";
import ProductGallery from "@/components/product/ProductGallery";
import { getDictionary } from "@/i18n/dictionaries";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/data/catalog";
import { isLocale } from "@/lib/i18n";
import {
  pickLocalizedDescription,
  pickLocalizedName,
} from "@/lib/utils";

interface ProductPageProps {
  params: { lang: string; slug: string };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { lang, slug } = params;

  if (!isLocale(lang)) {
    return {};
  }

  const product = await getProductBySlug(slug);

  if (!product) {
    return {};
  }

  return {
    title: pickLocalizedName(product, lang),
    description: pickLocalizedDescription(product, lang) ?? undefined,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { lang, slug } = params;

  if (!isLocale(lang)) {
    notFound();
  }

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [dictionary, related] = await Promise.all([
    getDictionary(lang),
    getRelatedProducts({
      categoryId: product.categoryId,
      excludeProductId: product.id,
      take: 4,
    }),
  ]);

  const title = pickLocalizedName(product, lang);
  const description = pickLocalizedDescription(product, lang);
  const brandLabel = product.brand ? pickLocalizedName(product.brand, lang) : null;
  const categoryLabel = pickLocalizedName(product.category, lang);

  return (
    <section className="mx-auto max-w-6xl space-y-14 px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <ProductGallery images={product.images} locale={lang} />

        <div className="space-y-6 rounded-[var(--radius-lg)] border border-subtle/60 bg-surface p-8 shadow-sm">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-muted">
              <span>{dictionary.product.categoryLabel as string}</span>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">{categoryLabel}</span>
              {brandLabel ? (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
                  {brandLabel}
                </span>
              ) : null}
            </div>
            <h1 className="text-4xl font-semibold text-ink">{title}</h1>
            {description ? <p className="text-base text-muted">{description}</p> : null}
          </div>

          {product.specs ? (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-ink">
                {dictionary.product.specsTitle as string}
              </h2>
              <div
                className="prose prose-neutral max-w-none text-sm text-muted [&_li]:my-1 [&_ul]:list-disc [&_ul]:pl-5"
                dangerouslySetInnerHTML={{ __html: product.specs }}
              />
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`/${lang}/catalog`}
              className="inline-flex items-center gap-2 rounded-full border border-subtle/80 px-4 py-2 text-sm font-semibold text-muted transition-colors hover:border-primary hover:text-primary"
            >
              {dictionary.product.backToCatalog as string}
            </a>
            <a
              href={`/${lang}/contact`}
              className="inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-transform hover:-translate-y-0.5"
            >
              {dictionary.buttons.contactUs as string}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="h-4 w-4"
              >
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {related.length ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-ink">
              {dictionary.product.relatedTitle as string}
            </h2>
            <a
              href={`/${lang}/catalog?category=${product.category.slug}`}
              className="text-sm font-semibold text-primary hover:underline"
            >
              {dictionary.buttons.viewAll as string}
            </a>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} locale={lang} dictionary={dictionary} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
