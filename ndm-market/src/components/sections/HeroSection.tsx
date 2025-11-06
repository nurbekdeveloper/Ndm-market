import Image from "next/image";
import Link from "next/link";

import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/lib/i18n";
import type { Banner } from "@prisma/client";

interface HeroSectionProps {
  locale: Locale;
  dictionary: Dictionary;
  banners: Banner[];
  stats: {
    categories: number;
    brands: number;
    products: number;
  };
}

export default function HeroSection({
  locale,
  dictionary,
  banners,
  stats,
}: HeroSectionProps) {
  const primaryBanner = banners[0];

  return (
    <section className="relative mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[var(--radius-lg)] bg-primary text-white">
        <div className="absolute inset-0">
          {primaryBanner ? (
            <Image
              src={primaryBanner.imageUrl}
              alt="NDM Market hero"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="h-full w-full object-cover opacity-60"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary via-primary-strong to-primary" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-primary/40" />
        </div>

        <div className="relative grid gap-10 p-10 lg:grid-cols-[1.05fr_0.95fr] lg:p-16">
          <div className="space-y-6 text-white">
            <span className="inline-flex items-center rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/90">
              {dictionary.hero.eyebrow as string}
            </span>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              {dictionary.hero.title as string}
            </h1>
            <p className="max-w-xl text-base leading-7 text-white/80 sm:text-lg">
              {dictionary.hero.description as string}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={`/${locale}/catalog`}
                className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow-lg shadow-primary/30 transition-transform hover:-translate-y-0.5"
              >
                {dictionary.hero.cta as string}
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
              </Link>
              <div className="flex gap-6 text-sm text-white/70">
                <div className="flex flex-col">
                  <span className="text-2xl font-semibold text-white">
                    {stats.products}+
                  </span>
                  <span>{dictionary.catalog.resultsLabel as string}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-semibold text-white">
                    {stats.categories}
                  </span>
                  <span>{dictionary.navigation.categories as string}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-semibold text-white">
                    {stats.brands}
                  </span>
                  <span>{dictionary.navigation.brands as string}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4">
              {banners.slice(0, 3).map((banner) => (
                <Link
                  key={banner.id}
                  href={banner.linkUrl ?? `/${locale}/catalog`}
                  className="relative flex h-32 items-end overflow-hidden rounded-[var(--radius-md)] bg-white/5 shadow-lg shadow-black/10 transition-transform hover:-translate-y-0.5"
                >
                  <Image
                    src={banner.imageUrl}
                    alt="NDM Market banner"
                    fill
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="h-full w-full object-cover opacity-60"
                  />
                  <div className="relative z-10 flex h-full w-full flex-col justify-end bg-gradient-to-t from-ink/60 via-ink/10 to-transparent p-4">
                    <span className="text-sm font-semibold text-white">
                      {dictionary.buttons.viewDetails as string}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
