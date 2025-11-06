import Link from "next/link";
import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import { saveUpload } from "@/lib/uploads";
import { slugify } from "@/lib/utils";

export default function NewCategoryPage() {
  async function createCategory(formData: FormData) {
    "use server";

    const nameUz = formData.get("nameUz")?.toString().trim();
    const nameRu = formData.get("nameRu")?.toString().trim();
    const descriptionUz = formData.get("descriptionUz")?.toString().trim() ?? null;
    const descriptionRu = formData.get("descriptionRu")?.toString().trim() ?? null;

    if (!nameUz || !nameRu) {
      throw new Error("Name fields are required");
    }

    const slugInput = formData.get("slug")?.toString().trim();
    let slug = slugInput || slugify(nameUz) || slugify(nameRu);
    if (!slug) {
      slug = `category-${Date.now()}`;
    }

    const exists = await prisma.category.findUnique({ where: { slug } });
    if (exists) {
      slug = `${slug}-${Date.now()}`;
    }

    let imageUrl: string | undefined;
    const file = formData.get("image");
    if (file && typeof file === "object" && file.size) {
      imageUrl = await saveUpload(file, "categories");
    }

    await prisma.category.create({
      data: {
        nameUz,
        nameRu,
        slug,
        descriptionUz,
        descriptionRu,
        imageUrl,
      },
    });

    redirect("/admin/categories");
  }

  return (
    <form
      action={createCategory}
      className="space-y-6 rounded-[var(--radius-lg)] border border-subtle/60 bg-surface p-6 shadow-sm"
      encType="multipart/form-data"
    >
      <div>
        <h1 className="text-3xl font-semibold text-ink">Add new category</h1>
        <p className="text-sm text-muted">Create a bilingual category with optional illustration.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-semibold text-muted">
          Name (UZ)
          <input
            name="nameUz"
            required
            className="w-full rounded-full border border-subtle/80 bg-surface px-4 py-3 text-sm font-medium text-ink outline-none focus:border-primary"
          />
        </label>
        <label className="space-y-2 text-sm font-semibold text-muted">
          Name (RU)
          <input
            name="nameRu"
            required
            className="w-full rounded-full border border-subtle/80 bg-surface px-4 py-3 text-sm font-medium text-ink outline-none focus:border-primary"
          />
        </label>
        <label className="space-y-2 text-sm font-semibold text-muted">
          Slug (optional)
          <input
            name="slug"
            placeholder="auto-generated"
            className="w-full rounded-full border border-subtle/80 bg-surface px-4 py-3 text-sm font-medium text-ink outline-none focus:border-primary"
          />
        </label>
      </div>

      <label className="space-y-2 text-sm font-semibold text-muted">
        Description (UZ)
        <textarea
          name="descriptionUz"
          rows={3}
          className="w-full rounded-3xl border border-subtle/80 bg-surface px-4 py-3 text-sm text-ink outline-none focus:border-primary"
        />
      </label>

      <label className="space-y-2 text-sm font-semibold text-muted">
        Description (RU)
        <textarea
          name="descriptionRu"
          rows={3}
          className="w-full rounded-3xl border border-subtle/80 bg-surface px-4 py-3 text-sm text-ink outline-none focus:border-primary"
        />
      </label>

      <label className="space-y-2 text-sm font-semibold text-muted">
        Category image
        <input
          type="file"
          name="image"
          accept="image/*"
          className="w-full rounded-full border border-subtle/80 bg-surface px-4 py-3 text-sm"
        />
        <span className="block text-xs text-muted">Landscape images look best (e.g. 4:3 ratio).</span>
      </label>

      <div className="flex justify-end gap-3 pt-4">
        <Link
          href="/admin/categories"
          className="rounded-full border border-subtle/80 px-5 py-3 text-sm font-semibold text-muted hover:border-primary hover:text-primary"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20"
        >
          Save category
        </button>
      </div>
    </form>
  );
}
