import { ProductVisibility } from "@prisma/client";
import type { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";
import { Locale, locales } from "@/lib/i18n";

const productWithRelationsArgs = {
  include: {
    category: true,
    brand: true,
    images: {
      orderBy: {
        order: "asc" as const,
      },
    },
  },
} satisfies Prisma.ProductDefaultArgs;

export type ProductWithRelations = Prisma.ProductGetPayload<typeof productWithRelationsArgs>;

export async function getLanguageOrder() {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: "languageOrder" },
  });

  if (!setting) {
    return Array.from(locales);
  }

  const order = setting.value
    .split(",")
    .map((item) => item.trim())
    .filter((item): item is Locale => locales.includes(item as Locale));

  return order.length ? order : Array.from(locales);
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

export async function getFeaturedProducts(limit = 6): Promise<ProductWithRelations[]> {
  const products = await prisma.product.findMany({
    where: { visibility: ProductVisibility.ACTIVE },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: productWithRelationsArgs.include,
  });

  return products as ProductWithRelations[];
}

export interface GetProductsParams {
  search?: string;
  categorySlug?: string;
  brandSlug?: string;
  take?: number;
  skip?: number;
}

export async function getProducts(params: GetProductsParams = {}): Promise<ProductWithRelations[]> {
  const { search, categorySlug, brandSlug, skip, take } = params;

  const products = await prisma.product.findMany({
    where: {
      visibility: ProductVisibility.ACTIVE,
      ...(search
        ? {
            OR: [
              { nameUz: { contains: search } },
              { nameRu: { contains: search } },
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
    include: productWithRelationsArgs.include,
  });

  return products as ProductWithRelations[];
}

export async function countProducts(params: GetProductsParams = {}) {
  const { search, categorySlug, brandSlug } = params;

  return prisma.product.count({
    where: {
      visibility: ProductVisibility.ACTIVE,
      ...(search
        ? {
            OR: [
              { nameUz: { contains: search } },
              { nameRu: { contains: search } },
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

export async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: productWithRelationsArgs.include,
  });

  return product as ProductWithRelations | null;
}

export async function getRelatedProducts(options: {
  categoryId: number;
  excludeProductId: number;
  take?: number;
}): Promise<ProductWithRelations[]> {
  const { categoryId, excludeProductId, take = 4 } = options;

  const products = await prisma.product.findMany({
    where: {
      visibility: ProductVisibility.ACTIVE,
      categoryId,
      id: { not: excludeProductId },
    },
    orderBy: { createdAt: "desc" },
    take,
    include: productWithRelationsArgs.include,
  });

  return products as ProductWithRelations[];
}
