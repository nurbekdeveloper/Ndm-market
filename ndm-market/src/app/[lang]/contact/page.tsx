export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";

import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/lib/i18n";

interface ContactPageProps {
  params: { lang: string };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const locale = params.lang;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale);
  const footer = dictionary.footer as Record<string, string>;

  return (
    <section className="mx-auto max-w-7xl space-y-12 px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl space-y-4">
        <span className="text-xs uppercase tracking-[0.3em] text-muted">
          {dictionary.navigation.contact as string}
        </span>
        <h1 className="text-4xl font-semibold text-ink">
          {dictionary.contact.title as string}
        </h1>
        <p className="text-base text-muted">
          {dictionary.contact.subtitle as string}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6 rounded-[var(--radius-lg)] border border-subtle/60 bg-surface p-8 shadow-sm">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-ink">
              {dictionary.contact.officeTitle as string}
            </h2>
            <p className="text-sm text-muted">{footer.address}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">
                {dictionary.contact.phoneLabel as string}
              </p>
              <Link href={`tel:${footer.phone}`} className="text-lg font-semibold text-ink">
                {footer.phone}
              </Link>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">
                {dictionary.contact.emailLabel as string}
              </p>
              <Link href={`mailto:${footer.email}`} className="text-lg font-semibold text-ink">
                {footer.email}
              </Link>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">
                {dictionary.contact.telegramLabel as string}
              </p>
              <Link
                href={`https://t.me/${footer.telegram?.replace("@", "")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-lg font-semibold text-primary"
              >
                {footer.telegram}
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
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">
                {dictionary.contact.hoursLabel as string}
              </p>
              <p className="text-sm text-muted">08:00 – 18:00 (Du – Sh)</p>
            </div>
          </div>

          <Link
            href={`tel:${footer.phone}`}
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
          </Link>
        </div>

        <div className="space-y-4 overflow-hidden rounded-[var(--radius-lg)] border border-subtle/60 p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-ink">
            {dictionary.contact.mapTitle as string}
          </h2>
          <iframe
            title="NDM Market Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2995.544786624474!2d69.2797375763221!3d41.30937327131015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b6dec4f74ef%3A0x6b0d0af485071725!2sToshkent!5e0!3m2!1sen!2suz!4v1700000000000!5m2!1sen!2suz"
            className="h-[380px] w-full rounded-[var(--radius-md)]"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
