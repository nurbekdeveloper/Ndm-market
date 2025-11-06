import Link from "next/link";
import { revalidatePath } from "next/cache";

import { getCategoriesWithCount } from "@/lib/data/catalog";
import prisma from "@/lib/prisma";

export default async function AdminCategoriesPage() {
  const categories = await getCategoriesWithCount();

  async function deleteCategory(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));

    if (!id) {
      return;
    }

    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      throw new Error("Cannot delete category with assigned products");
    }

    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/categories");
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-ink">Categories</h1>
          <p className="text-sm text-muted">Organize the catalog structure and imagery.</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20"
        >
          + New category
        </Link>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-subtle/60 bg-surface shadow-sm">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead className="bg-subtle/50 text-xs uppercase tracking-[0.25em] text-muted">
            <tr>
              <th className="px-6 py-4">Name (UZ)</th>
              <th className="px-6 py-4">Name (RU)</th>
              <th className="px-6 py-4">Slug</th>
              <th className="px-6 py-4">Products</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-subtle/60">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-subtle/20">
                <td className="px-6 py-4 font-semibold text-ink">{category.nameUz}</td>
                <td className="px-6 py-4 text-muted">{category.nameRu}</td>
                <td className="px-6 py-4 text-muted">{category.slug}</td>
                <td className="px-6 py-4 text-muted">{category.activeProductCount}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/categories/${category.id}`}
                      className="rounded-full border border-subtle/80 px-4 py-2 text-xs font-semibold text-muted transition-colors hover:border-primary hover:text-primary"
                    >
                      Edit
                    </Link>
                    <form action={deleteCategory}>
                      <input type="hidden" name="id" value={category.id} />
                      <button
                        type="submit"
                        className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50"
                        disabled={category.activeProductCount > 0}
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
