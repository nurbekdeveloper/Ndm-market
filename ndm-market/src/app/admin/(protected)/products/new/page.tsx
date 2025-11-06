import Link from "next/link";
import { redirect } from "next/navigation";

import { ProductVisibility } from "@prisma/client";

import prisma from "@/lib/prisma";
import { saveUpload } from "@/lib/uploads";
import { slugify } from "@/lib/utils";

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ orderBy: { nameUz: "asc" } }),
    prisma.brand.findMany({ orderBy: { nameUz: "asc" } }),
  ]);

  async function createProduct(formData: FormData) {
    "use server";

    const nameUz = formData.get("nameUz")?.toString().trim();
    const nameRu = formData.get("nameRu")?.toString().trim();
    const descriptionUz = formData.get("descriptionUz")?.toString().trim() ?? null;
    const descriptionRu = formData.get("descriptionRu")?.toString().trim() ?? null;
    const specs = formData.get("specs")?.toString() ?? null;
    const categoryId = Number(formData.get("categoryId"));
    const brandIdRaw = formData.get("brandId")?.toString();
    const brandId = brandIdRaw ? Number(brandIdRaw) : null;
    const visibilityValue = formData.get("visibility")?.toString() as ProductVisibility | undefined;

    if (!nameUz || !nameRu || !categoryId) {
      throw new Error("Missing required fields");
    }

    const slugInput = formData.get("slug")?.toString().trim();
    let slug = slugInput || slugify(nameUz) || slugify(nameRu);
    if (!slug) {
      slug = `product-${Date.now()}`;
    }

    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const files = formData.getAll("images") as File[];
    const uploadedImages: string[] = [];

    for (const file of files) {
      if (typeof file === "object" && file.size) {
        const url = await saveUpload(file, "products");
        uploadedImages.push(url);
      }
    }

    await prisma.product.create({
      data: {
        nameUz,
        nameRu,
        slug,
        descriptionUz,
        descriptionRu,
        specs,
        visibility: visibilityValue ?? ProductVisibility.ACTIVE,
        category: { connect: { id: categoryId } },
        ...(brandId ? { brand: { connect: { id: brandId } } } : {}),
        images: {
          create: uploadedImages.map((url, index) => ({
            url,
            order: index,
          })),
        },
      },
    });

    redirect("/admin/products");
  }

  return (
    <form
      action={createProduct}
      className="space-y-6 rounded-[var(--radius-lg)] border border-subtle/60 bg-surface p-6 shadow-sm"
      encType="multipart/form-data"
    >
      <div>
        <h1 className="text-3xl font-semibold text-ink">Add new product</h1>
        <p className="text-sm text-muted">Provide bilingual titles and assets to publish the item.</p>
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
        <label className="space-y-2 text-sm font-semibold text-muted">
          Visibility
          <select
            name="visibility"
            defaultValue={ProductVisibility.ACTIVE}
            className="w-full rounded-full border border-subtle/80 bg-surface px-4 py-3 text-sm font-medium text-ink outline-none focus:border-primary"
          >
            <option value={ProductVisibility.ACTIVE}>Active</option>
            <option value={ProductVisibility.HIDDEN}>Hidden</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-semibold text-muted">
          Category
          <select
            name="categoryId"
            required
            className="w-full rounded-full border border-subtle/80 bg-surface px-4 py-3 text-sm font-medium text-ink outline-none focus:border-primary"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nameUz}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm font-semibold text-muted">
          Brand (optional)
          <select
            name="brandId"
            className="w-full rounded-full border border-subtle/80 bg-surface px-4 py-3 text-sm font-medium text-ink outline-none focus:border-primary"
          >
            <option value="">No brand</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.nameUz}
              </option>
            ))}
          </select>
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
        Technical specifications (HTML allowed)
        <textarea
          name="specs"
          rows={5}
          placeholder="<ul><li>Specification item</li></ul>"
          className="w-full rounded-3xl border border-subtle/80 bg-surface px-4 py-3 text-sm text-ink outline-none focus:border-primary"
        />
      </label>

      <label className="space-y-2 text-sm font-semibold text-muted">
        Image gallery
        <input
          type="file"
          name="images"
          multiple
          accept="image/*"
          className="w-full rounded-full border border-subtle/80 bg-surface px-4 py-3 text-sm"
        />
        <span className="block text-xs text-muted">
          Upload multiple images to create the gallery (first image becomes the cover).
        </span>
      </label>

      <div className="flex justify-end gap-3 pt-4">
        <Link
          href="/admin/products"
          className="rounded-full border border-subtle/80 px-5 py-3 text-sm font-semibold text-muted hover:border-primary hover:text-primary"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20"
        >
          Save product
        </button>
      </div>
    </form>
  );
}
