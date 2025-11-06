import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import { getDictionary } from "@/i18n/dictionaries";
import { getLanguageOrder } from "@/lib/data/catalog";
import { isLocale, locales } from "@/lib/i18n";

interface LanguageLayoutProps {
  children: ReactNode;
  params: { lang: string };
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const { lang } = params;

  if (!isLocale(lang)) {
    return {};
  }

  const dictionary = await getDictionary(lang);

  return {
    title: dictionary.meta?.title as string,
    description: dictionary.meta?.description as string,
  };
}

export default async function LanguageLayout({
  children,
  params,
}: LanguageLayoutProps) {
  const locale = params.lang;

  if (!isLocale(locale)) {
    notFound();
  }

  const [dictionary, languageOrder] = await Promise.all([
    getDictionary(locale),
    getLanguageOrder(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <SiteHeader locale={locale} dictionary={dictionary} languageOrder={languageOrder} />
      <main className="flex-1 bg-surface">{children}</main>
      <SiteFooter locale={locale} dictionary={dictionary} />
    </div>
  );
}
