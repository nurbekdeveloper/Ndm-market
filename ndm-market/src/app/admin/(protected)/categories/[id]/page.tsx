import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import { saveUpload } from "@/lib/uploads";
import { slugify } from "@/lib/utils";

interface EditCategoryPageProps {
  params: { id: string };
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const id = Number(params.id);

  if (!id) {
    redirect("/admin/categories");
  }

  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) {
    redirect("/admin/categories");
  }

  const existingCategory = category;

  async function updateCategory(formData: FormData) {
    "use server";

    const nameUz = formData.get("nameUz")?.toString().trim();
    const nameRu = formData.get("nameRu")?.toString().trim();
    const descriptionUz = formData.get("descriptionUz")?.toString().trim() ?? null;
    const descriptionRu = formData.get("descriptionRu")?.toString().trim() ?? null;
    const slugInput = formData.get("slug")?.toString().trim();
    const removeImage = formData.get("removeImage")?.toString() === "on";
    const file = formData.get("image");

    if (!nameUz || !nameRu) {
      throw new Error("Names are required");
    }

    let slug = slugInput || slugify(nameUz) || slugify(nameRu) || existingCategory.slug;

    if (slug !== existingCategory.slug) {
      const exists = await prisma.category.findUnique({ where: { slug } });
      if (exists) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    let imageUrl = existingCategory.imageUrl ?? undefined;
    if (file && typeof file === "object" && file.size) {
      imageUrl = await saveUpload(file, "categories");
    } else if (removeImage) {
      imageUrl = undefined;
    }

    await prisma.category.update({
      where: { id: existingCategory.id },
      data: {
        nameUz,
        nameRu,
        descriptionUz,
        descriptionRu,
        slug,
        imageUrl,
      },
    });

    redirect("/admin/categories");
  }

  return (
    <form
      action={updateCategory}
      className="space-y-6 rounded-[var(--radius-lg)] border border-subtle/60 bg-surface p-6 shadow-sm"
      encType="multipart/form-data"
    >
      <div>
        <h1 className="text-3xl font-semibold text-ink">Edit category</h1>
        <p className="text-sm text-muted">Update translations and imagery for this category.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-semibold text-muted">
          Name (UZ)
          <input
            name="nameUz"
              defaultValue={existingCategory.nameUz}
            required
            className="w-full rounded-full border border-subtle/80 bg-surface px-4 py-3 text-sm font-medium text-ink outline-none focus:border-primary"
          />
        </label>
        <label className="space-y-2 text-sm font-semibold text-muted">
          Name (RU)
          <input
            name="nameRu"
              defaultValue={existingCategory.nameRu}
            required
            className="w-full rounded-full border border-subtle/80 bg-surface px-4 py-3 text-sm font-medium text-ink outline-none focus:border-primary"
          />
        </label>
        <label className="space-y-2 text-sm font-semibold text-muted">
          Slug
          <input
            name="slug"
              defaultValue={existingCategory.slug}
            className="w-full rounded-full border border-subtle/80 bg-surface px-4 py-3 text-sm font-medium text-ink outline-none focus:border-primary"
          />
        </label>
      </div>

      <label className="space-y-2 text-sm font-semibold text-muted">
        Description (UZ)
        <textarea
          name="descriptionUz"
          rows={3}
            defaultValue={existingCategory.descriptionUz ?? ""}
          className="w-full rounded-3xl border border-subtle/80 bg-surface px-4 py-3 text-sm text-ink outline-none focus:border-primary"
        />
      </label>

      <label className="space-y-2 text-sm font-semibold text-muted">
        Description (RU)
        <textarea
          name="descriptionRu"
          rows={3}
            defaultValue={existingCategory.descriptionRu ?? ""}
          className="w-full rounded-3xl border border-subtle/80 bg-surface px-4 py-3 text-sm text-ink outline-none focus:border-primary"
        />
      </label>

      <div className="space-y-2 text-sm font-semibold text-muted">
        <span>Current image</span>
          {existingCategory.imageUrl ? (
          <div className="flex items-center gap-4">
            <Image
                src={existingCategory.imageUrl}
                alt={existingCategory.nameUz}
              width={192}
              height={128}
              className="h-32 w-48 rounded-[var(--radius-md)] object-cover"
            />
            <label className="flex items-center gap-2 text-xs font-semibold text-muted">
              <input type="checkbox" name="removeImage" /> Remove image
            </label>
          </div>
        ) : (
          <p className="text-xs text-muted">No image uploaded yet.</p>
        )}
      </div>

      <label className="space-y-2 text-sm font-semibold text-muted">
        Replace image
        <input
          type="file"
          name="image"
          accept="image/*"
          className="w-full rounded-full border border-subtle/80 bg-surface px-4 py-3 text-sm"
        />
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
          Update category
        </button>
      </div>
    </form>
  );
}
