export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";

import CategoryCard from "@/components/cards/CategoryCard";
import { getDictionary } from "@/i18n/dictionaries";
import { getCategoriesWithCount } from "@/lib/data/catalog";
import { isLocale } from "@/lib/i18n";

interface CategoriesPageProps {
  params: { lang: string };
}

export default async function CategoriesPage({ params }: CategoriesPageProps) {
  const locale = params.lang;

  if (!isLocale(locale)) {
    notFound();
  }

  const [dictionary, categories] = await Promise.all([
    getDictionary(locale),
    getCategoriesWithCount(),
  ]);

  return (
    <section className="mx-auto max-w-7xl space-y-12 px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl space-y-4">
        <span className="text-xs uppercase tracking-[0.3em] text-muted">
          {dictionary.navigation.categories as string}
        </span>
        <h1 className="text-4xl font-semibold text-ink">
          {dictionary.categories.title as string}
        </h1>
        <p className="text-base text-muted">
          {dictionary.categories.subtitle as string}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
  );
}
