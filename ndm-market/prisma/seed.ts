import "dotenv/config";

import { PrismaClient, ProductVisibility } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type SeedCategory = {
  slug: string;
  nameUz: string;
  nameRu: string;
  descriptionUz?: string;
  descriptionRu?: string;
  imageUrl?: string;
};

type SeedBrand = {
  slug: string;
  nameUz: string;
  nameRu: string;
  logoUrl?: string;
};

type SeedProduct = {
  slug: string;
  nameUz: string;
  nameRu: string;
  descriptionUz: string;
  descriptionRu: string;
  specs: string;
  visibility: ProductVisibility;
  categorySlug: string;
  brandSlug: string;
  images: { url: string; altUz?: string; altRu?: string }[];
};

const categories: SeedCategory[] = [
  {
    slug: "beton-va-temirbeton",
    nameUz: "Beton va Temir-beton",
    nameRu: "Бетон и железобетон",
    descriptionUz:
      "Yuqori mustahkamlikka ega, ilg‘or texnologiyalar asosida ishlab chiqarilgan temir-beton buyumlar.",
    descriptionRu:
      "Высокопрочные железобетонные изделия, созданные по современным технологиям.",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-0ef3c08a84a3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "qurilish-aralashmalari",
    nameUz: "Qurilish aralashmalari",
    nameRu: "Строительные смеси",
    descriptionUz:
      "Sifatli qoplama, betonlash va bezatish ishlari uchun professionallar tanlovi.",
    descriptionRu:
      "Профессиональный выбор для отделочных, бетонных и декоративных работ.",
    imageUrl:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "metall-konstruktsiyalar",
    nameUz: "Metall konstruktsiyalar",
    nameRu: "Металлоконструкции",
    descriptionUz:
      "Har qanday masshtabdagi inshootlar uchun mustahkam va bardoshli metall yechimlar.",
    descriptionRu:
      "Надежные металлические решения для сооружений любого масштаба.",
    imageUrl:
      "https://images.unsplash.com/photo-1529429617124-aee4417cb4c7?auto=format&fit=crop&w=1200&q=80",
  },
];

const brands: SeedBrand[] = [
  {
    slug: "ndm-structural",
    nameUz: "NDM Structural",
    nameRu: "NDM Structural",
    logoUrl:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=400&q=70",
  },
  {
    slug: "euro-mix",
    nameUz: "EuroMix",
    nameRu: "EuroMix",
    logoUrl:
      "https://images.unsplash.com/photo-1437482078695-73f5ca6c96e8?auto=format&fit=crop&w=400&q=70",
  },
  {
    slug: "metpro",
    nameUz: "MetPro Alliance",
    nameRu: "MetPro Alliance",
    logoUrl:
      "https://images.unsplash.com/photo-1565183928294-7063f23ce0f8?auto=format&fit=crop&w=400&q=70",
  },
];

const products: SeedProduct[] = [
  {
    slug: "prefabrik-beton-panellar",
    nameUz: "Prefabrik beton panellar",
    nameRu: "Префабрикованные бетонные панели",
    descriptionUz:
      "Tezkor montaj va yuqori issiqlik izolyatsiyasiga ega sanoat darajadagi panellar.",
    descriptionRu:
      "Скоростной монтаж и высокая теплоизоляция для промышленных объектов.",
    specs: `<ul>
  <li>Mustahkamlik darajasi: B60</li>
  <li>Izolyatsiya koeffitsienti: 0.24 W/m²K</li>
  <li>Panel o‘lchami: 3200 x 6000 mm</li>
</ul>`,
    visibility: ProductVisibility.ACTIVE,
    categorySlug: "beton-va-temirbeton",
    brandSlug: "ndm-structural",
    images: [
      {
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
        altUz: "Prefabrik beton panellar",
        altRu: "Панели из железобетона",
      },
    ],
  },
  {
    slug: "polimer-asosli-shtukaturka",
    nameUz: "Polimer asosli shtukaturka",
    nameRu: "Полимерная штукатурка",
    descriptionUz:
      "Fasad va interyerlar uchun yuqori elastiklikka ega dekorativ qoplama.",
    descriptionRu:
      "Декоративное покрытие с высокой эластичностью для фасадов и интерьеров.",
    specs: `<ul>
  <li>Qadoqlash: 25 kg qop</li>
  <li>Yumshoq ishlov berish va tez qurish</li>
  <li>Tavsiyaviy qatlam qalinligi: 2-5 mm</li>
</ul>`,
    visibility: ProductVisibility.ACTIVE,
    categorySlug: "qurilish-aralashmalari",
    brandSlug: "euro-mix",
    images: [
      {
        url: "https://images.unsplash.com/photo-1451976426598-a7593bd6d0b2?auto=format&fit=crop&w=1200&q=80",
        altUz: "Shtukaturka qoplamasi",
        altRu: "Нанесение штукатурки",
      },
    ],
  },
  {
    slug: "ogir-metall-fermalar",
    nameUz: "Og‘ir metall fermalar",
    nameRu: "Стальные фермы",
    descriptionUz:
      "Uzoq xizmat muddati va yuqori yuk ko‘tarish qobiliyatiga ega sanoat fermalar.",
    descriptionRu:
      "Промышленные фермы с большим сроком службы и высокой несущей способностью.",
    specs: `<ul>
  <li>Material: S355 konstruktsion po‘lat</li>
  <li>Maksimal oralig‘i: 42 metr</li>
  <li>Himoya qoplamasi: Issiq galvaniz</li>
</ul>`,
    visibility: ProductVisibility.ACTIVE,
    categorySlug: "metall-konstruktsiyalar",
    brandSlug: "metpro",
    images: [
      {
        url: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
        altUz: "Metall fermalar",
        altRu: "Стальные фермы",
      },
    ],
  },
  {
    slug: "beton-aralashtirgich-kompleksi",
    nameUz: "Beton aralashtirgich kompleksi",
    nameRu: "Бетонный смесительный комплекс",
    descriptionUz:
      "Avtomatlashtirilgan beton tayyorlash uchun yuqori unumdorlikdagi tizim.",
    descriptionRu:
      "Высокоэффективная система для автоматизированного приготовления бетона.",
    specs: `<ul>
  <li>Ishlab chiqarish quvvati: 120 m³/soat</li>
  <li>PLC boshqaruvi: Siemens S7</li>
  <li>Energiya sarfi: 110 kW</li>
</ul>`,
    visibility: ProductVisibility.ACTIVE,
    categorySlug: "beton-va-temirbeton",
    brandSlug: "ndm-structural",
    images: [
      {
        url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
        altUz: "Beton aralashtirgich",
        altRu: "Бетонный завод",
      },
    ],
  },
];

const banners = [
  {
    imageUrl:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80",
    linkUrl: "/catalog",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1503389152951-9f343605f61e?auto=format&fit=crop&w=1600&q=80",
    linkUrl: "/contact",
  },
];

async function main() {
  const adminUsername = process.env.INITIAL_ADMIN_USERNAME ?? "admin";
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD ?? "admin123";

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { username: adminUsername },
    update: {},
    create: {
      username: adminUsername,
      passwordHash,
    },
  });

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        nameUz: category.nameUz,
        nameRu: category.nameRu,
        descriptionUz: category.descriptionUz,
        descriptionRu: category.descriptionRu,
        imageUrl: category.imageUrl,
      },
      create: {
        ...category,
      },
    });
  }

  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {
        nameUz: brand.nameUz,
        nameRu: brand.nameRu,
        logoUrl: brand.logoUrl,
      },
      create: {
        ...brand,
      },
    });
  }

  for (const banner of banners) {
    await prisma.banner.upsert({
      where: { imageUrl: banner.imageUrl },
      update: {
        linkUrl: banner.linkUrl,
      },
      create: banner,
    });
  }

  for (const product of products) {
    const category = await prisma.category.findUniqueOrThrow({
      where: { slug: product.categorySlug },
    });
    const brand = await prisma.brand.findUniqueOrThrow({
      where: { slug: product.brandSlug },
    });

    await prisma.product.upsert({
      where: { slug: product.slug },
      create: {
        nameUz: product.nameUz,
        nameRu: product.nameRu,
        slug: product.slug,
        descriptionUz: product.descriptionUz,
        descriptionRu: product.descriptionRu,
        specs: product.specs,
        visibility: product.visibility,
        category: { connect: { id: category.id } },
        brand: { connect: { id: brand.id } },
        images: {
          create: product.images.map((image, index) => ({
            url: image.url,
            altUz: image.altUz,
            altRu: image.altRu,
            order: index,
          })),
        },
      },
      update: {
        nameUz: product.nameUz,
        nameRu: product.nameRu,
        descriptionUz: product.descriptionUz,
        descriptionRu: product.descriptionRu,
        specs: product.specs,
        visibility: product.visibility,
        category: { connect: { id: category.id } },
        brand: { connect: { id: brand.id } },
        images: {
          deleteMany: {},
          create: product.images.map((image, index) => ({
            url: image.url,
            altUz: image.altUz,
            altRu: image.altRu,
            order: index,
          })),
        },
      },
    });
  }

  await prisma.siteSetting.upsert({
    where: { key: "languageOrder" },
    update: { value: "uz,ru" },
    create: { key: "languageOrder", value: "uz,ru" },
  });

  console.log("Database seeded successfully");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
