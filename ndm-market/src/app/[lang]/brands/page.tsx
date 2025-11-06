export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";

import BrandCard from "@/components/cards/BrandCard";
import { getDictionary } from "@/i18n/dictionaries";
import { getBrandsWithCount } from "@/lib/data/catalog";
import { isLocale } from "@/lib/i18n";

interface BrandsPageProps {
  params: { lang: string };
}

export default async function BrandsPage({ params }: BrandsPageProps) {
  const locale = params.lang;

  if (!isLocale(locale)) {
    notFound();
  }

  const [dictionary, brands] = await Promise.all([
    getDictionary(locale),
    getBrandsWithCount(),
  ]);

  return (
    <section className="mx-auto max-w-7xl space-y-12 px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl space-y-4">
        <span className="text-xs uppercase tracking-[0.3em] text-muted">
          {dictionary.navigation.brands as string}
        </span>
        <h1 className="text-4xl font-semibold text-ink">
          {dictionary.brands.title as string}
        </h1>
        <p className="text-base text-muted">
          {dictionary.brands.subtitle as string}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {brands.map((brand) => (
          <BrandCard key={brand.id} brand={brand} locale={locale} dictionary={dictionary} />
        ))}
      </div>
    </section>
  );
}
