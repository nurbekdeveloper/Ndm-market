export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";

import CategoryCard from "@/components/cards/CategoryCard";
import ProductCard from "@/components/cards/ProductCard";
import HeroSection from "@/components/sections/HeroSection";
import { getDictionary } from "@/i18n/dictionaries";
import {
  countProducts,
  getBanners,
  getBrandsWithCount,
  getCategoriesWithCount,
  getFeaturedProducts,
} from "@/lib/data/catalog";
import { isLocale } from "@/lib/i18n";

interface HomePageProps {
  params: { lang: string };
}

export default async function HomePage({ params }: HomePageProps) {
  const locale = params.lang;

  if (!isLocale(locale)) {
    notFound();
  }

  const [dictionary, banners, categories, brands, featured, totalProducts] =
    await Promise.all([
      getDictionary(locale),
      getBanners(),
      getCategoriesWithCount(),
      getBrandsWithCount(),
      getFeaturedProducts(8),
      countProducts(),
    ]);

  return (
    <div className="space-y-16 pb-16">
      <HeroSection
        locale={locale}
        dictionary={dictionary}
        banners={banners}
        stats={{
          categories: categories.length,
          brands: brands.length,
          products: totalProducts,
        }}
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-muted">
              {dictionary.navigation.categories as string}
            </span>
            <h2 className="mt-2 text-3xl font-semibold text-ink">
              {dictionary.home.categoriesHeading as string}
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-muted">
              {dictionary.home.categoriesDescription as string}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              locale={locale}
              dictionary={dictionary}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-muted">
              {dictionary.navigation.catalog as string}
            </span>
            <h2 className="mt-2 text-3xl font-semibold text-ink">
              {dictionary.home.featuredHeading as string}
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-muted">
              {dictionary.home.featuredDescription as string}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              locale={locale}
              dictionary={dictionary}
            />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href={`/${locale}/catalog`}
            className="inline-flex items-center gap-3 rounded-full border border-primary/30 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            {dictionary.home.viewCatalogCta as string}
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
      </section>
    </div>
  );
}
