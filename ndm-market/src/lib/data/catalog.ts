import { ProductVisibility } from "@prisma/client";

import prisma from "@/lib/prisma";
import { Locale, locales } from "@/lib/i18n";

export async function getLanguageOrder() {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: "languageOrder" },
  });

  if (!setting) {
    return locales;
  }

  const order = setting.value
    .split(",")
    .map((item) => item.trim())
    .filter((item): item is Locale => locales.includes(item as Locale));

  return order.length ? order : locales;
}

export async function getBanners() {
  return prisma.banner.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getCategoriesWithCount() {
  const [categories, categoryCounts] = await Promise.all([
    prisma.category.findMany({
      orderBy: { createdAt: "asc" },
    }),
    prisma.product.groupBy({
      by: ["categoryId"],
      _count: { _all: true },
      where: { visibility: ProductVisibility.ACTIVE },
    }),
  ]);

  const countMap = new Map<number, number>(
    categoryCounts.map((item) => [item.categoryId, item._count._all])
  );

  return categories.map((category) => ({
    ...category,
    activeProductCount: countMap.get(category.id) ?? 0,
  }));
}

export async function getBrandsWithCount() {
  const [brands, brandCounts] = await Promise.all([
    prisma.brand.findMany({
      orderBy: { createdAt: "asc" },
    }),
    prisma.product.groupBy({
      by: ["brandId"],
      _count: { _all: true },
      where: {
        visibility: ProductVisibility.ACTIVE,
        brandId: { not: null },
      },
    }),
  ]);

  const countMap = new Map<number, number>(
    brandCounts.map((item) => [item.brandId!, item._count._all])
  );

  return brands.map((brand) => ({
    ...brand,
    activeProductCount: countMap.get(brand.id) ?? 0,
  }));
}

export async function getFeaturedProducts(limit = 6) {
  return prisma.product.findMany({
    where: { visibility: ProductVisibility.ACTIVE },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      category: true,
      brand: true,
      images: { orderBy: { order: "asc" } },
    },
  });
}

export interface GetProductsParams {
  search?: string;
  categorySlug?: string;
  brandSlug?: string;
  take?: number;
  skip?: number;
}

export async function getProducts(params: GetProductsParams = {}) {
  const { search, categorySlug, brandSlug, skip, take } = params;

  return prisma.product.findMany({
    where: {
      visibility: ProductVisibility.ACTIVE,
      ...(search
        ? {
            OR: [
              { nameUz: { contains: search, mode: "insensitive" } },
              { nameRu: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(categorySlug
        ? {
            category: { slug: categorySlug },
          }
        : {}),
      ...(brandSlug
        ? {
            brand: { slug: brandSlug },
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    skip,
    take,
    include: {
      category: true,
      brand: true,
      images: { orderBy: { order: "asc" } },
    },
  });
}

export async function countProducts(params: GetProductsParams = {}) {
  const { search, categorySlug, brandSlug } = params;

  return prisma.product.count({
    where: {
      visibility: ProductVisibility.ACTIVE,
      ...(search
        ? {
            OR: [
              { nameUz: { contains: search, mode: "insensitive" } },
              { nameRu: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(categorySlug
        ? {
            category: { slug: categorySlug },
          }
        : {}),
      ...(brandSlug
        ? {
            brand: { slug: brandSlug },
          }
        : {}),
    },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      brand: true,
      images: { orderBy: { order: "asc" } },
    },
  });
}

export async function getRelatedProducts(options: {
  categoryId: number;
  excludeProductId: number;
  take?: number;
}) {
  const { categoryId, excludeProductId, take = 4 } = options;

  return prisma.product.findMany({
    where: {
      visibility: ProductVisibility.ACTIVE,
      categoryId,
      id: { not: excludeProductId },
    },
    orderBy: { createdAt: "desc" },
    take,
    include: {
      category: true,
      brand: true,
      images: { orderBy: { order: "asc" } },
    },
  });
}
