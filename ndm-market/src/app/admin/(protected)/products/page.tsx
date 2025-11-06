import Link from "next/link";
import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      brand: true,
    },
  });

  async function deleteProduct(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));

    if (!id) {
      return;
    }

    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-ink">Products</h1>
          <p className="text-sm text-muted">Manage catalog entries across both languages.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20"
        >
          + New product
        </Link>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-subtle/60 bg-surface shadow-sm">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead className="bg-subtle/50 text-xs uppercase tracking-[0.25em] text-muted">
            <tr>
              <th className="px-6 py-4">Name (UZ)</th>
              <th className="px-6 py-4">Name (RU)</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Brand</th>
              <th className="px-6 py-4">Visibility</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-subtle/60">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-subtle/20">
                <td className="px-6 py-4 text-sm font-semibold text-ink">{product.nameUz}</td>
                <td className="px-6 py-4 text-sm text-muted">{product.nameRu}</td>
                <td className="px-6 py-4 text-sm text-muted">{product.category.nameUz}</td>
                <td className="px-6 py-4 text-sm text-muted">{product.brand?.nameUz ?? "—"}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      product.visibility === "ACTIVE"
                        ? "bg-primary/10 text-primary"
                        : "bg-subtle text-muted"
                    }`}
                  >
                    {product.visibility}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="rounded-full border border-subtle/80 px-4 py-2 text-xs font-semibold text-muted transition-colors hover:border-primary hover:text-primary"
                    >
                      Edit
                    </Link>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={product.id} />
                      <button
                        type="submit"
                        className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
