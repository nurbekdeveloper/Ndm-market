import { Locale } from "@/lib/i18n";

export function pickLocalizedName(
  entity: { nameUz: string; nameRu: string },
  locale: Locale
) {
  return locale === "uz" ? entity.nameUz : entity.nameRu;
}

export function pickLocalizedDescription(
  entity: { descriptionUz?: string | null; descriptionRu?: string | null },
  locale: Locale
) {
  return locale === "uz" ? entity.descriptionUz : entity.descriptionRu;
}

export function pickLocalizedAlt(
  entity: { altUz?: string | null; altRu?: string | null },
  locale: Locale
) {
  return locale === "uz" ? entity.altUz : entity.altRu;
}

export function formatRightsTemplate(template: string, year: number) {
  return template.replace("{year}", String(year));
}

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
