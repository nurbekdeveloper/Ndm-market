import Link from "next/link";

import prisma from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [productCount, categoryCount, brandCount, bannerCount, recentProducts] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.brand.count(),
      prisma.banner.count(),
      prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          category: true,
          brand: true,
        },
      }),
    ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-semibold text-ink">Dashboard</h1>
        <p className="text-sm text-muted">
          Overview of catalog metrics and latest product updates.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {[{
          label: "Products",
          value: productCount,
          description: "Total catalog entries",
        },
        {
          label: "Categories",
          value: categoryCount,
          description: "Active product groups",
        },
        {
          label: "Brands",
          value: brandCount,
          description: "Manufacturers",
        },
        {
          label: "Banners",
          value: bannerCount,
          description: "Homepage hero assets",
        }].map((card) => (
          <div
            key={card.label}
            className="rounded-[var(--radius-lg)] border border-subtle/60 bg-surface p-6 shadow-sm"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-muted">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold text-ink">{card.value}</p>
            <p className="text-sm text-muted">{card.description}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[var(--radius-lg)] border border-subtle/60 bg-surface p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-ink">Recent products</h2>
            <Link
              href="/admin/products"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Manage products
            </Link>
          </div>

        <div className="mt-6 divide-y divide-subtle/60 text-sm">
          {recentProducts.map((product) => (
            <div key={product.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-semibold text-ink">{product.nameUz}</p>
                <p className="text-xs text-muted">
                  {product.category.nameUz}
                  {product.brand ? ` · ${product.brand.nameUz}` : ""}
                </p>
              </div>
                <Link
                  href={`/admin/products/${product.id}`}
                  className="rounded-full border border-subtle/80 px-3 py-1 text-xs font-semibold text-muted transition-colors hover:border-primary hover:text-primary"
                >
                  Edit
                </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
