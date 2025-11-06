export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ProductVisibility } from "@prisma/client";

import prisma from "@/lib/prisma";
import { saveUpload } from "@/lib/uploads";
import { slugify } from "@/lib/utils";

interface ProductEditPageProps {
  params: { id: string };
}

export default async function EditProductPage({ params }: ProductEditPageProps) {
  const id = Number(params.id);

  if (!id) {
    redirect("/admin/products");
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: "asc" } },
    },
  });

  if (!product) {
    redirect("/admin/products");
  }

  const existingProduct = product;

  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ orderBy: { nameUz: "asc" } }),
    prisma.brand.findMany({ orderBy: { nameUz: "asc" } }),
  ]);

  async function updateProduct(formData: FormData) {
    "use server";

    const nameUz = formData.get("nameUz")?.toString().trim();
    const nameRu = formData.get("nameRu")?.toString().trim();
    const descriptionUz = formData.get("descriptionUz")?.toString().trim() ?? null;
    const descriptionRu = formData.get("descriptionRu")?.toString().trim() ?? null;
    const specs = formData.get("specs")?.toString() ?? null;
    const categoryId = Number(formData.get("categoryId"));
    const brandIdValue = formData.get("brandId")?.toString();
    const brandId = brandIdValue ? Number(brandIdValue) : null;
    const visibilityValue = formData.get("visibility")?.toString() as ProductVisibility | undefined;
    const slugInput = formData.get("slug")?.toString().trim();

    if (!nameUz || !nameRu || !categoryId) {
      throw new Error("Missing required fields");
    }

    let slug = slugInput || slugify(nameUz) || slugify(nameRu);
    if (!slug) {
      slug = existingProduct.slug;
    }

    if (slug !== existingProduct.slug) {
      const exists = await prisma.product.findUnique({ where: { slug } });
      if (exists && exists.id !== existingProduct.id) {
        slug = `${slug}-${existingProduct.id}`;
      }
    }

    const removeImageIds = formData
      .getAll("removeImage")
      .map((value) => Number(value))
      .filter(Boolean);

    const newFiles = formData.getAll("newImages") as File[];
    const uploaded: string[] = [];

    for (const file of newFiles) {
      if (typeof file === "object" && file.size) {
        const url = await saveUpload(file, "products");
        uploaded.push(url);
      }
    }

    const nextOrder = await prisma.productImage.count({ where: { productId: existingProduct.id } });

    await prisma.product.update({
      where: { id: existingProduct.id },
      data: {
        nameUz,
        nameRu,
        slug,
        descriptionUz,
        descriptionRu,
        specs,
        visibility: visibilityValue ?? ProductVisibility.ACTIVE,
        category: { connect: { id: categoryId } },
        ...(brandId ? { brand: { connect: { id: brandId } } } : { brand: { disconnect: true } }),
        images: {
          deleteMany: removeImageIds.length ? { id: { in: removeImageIds } } : undefined,
          create: uploaded.map((url, index) => ({
            url,
            order: nextOrder + index,
          })),
        },
      },
    });

    redirect("/admin/products");
  }

  return (
    <form
      action={updateProduct}
      className="space-y-6 rounded-[var(--radius-lg)] border border-subtle/60 bg-surface p-6 shadow-sm"
      encType="multipart/form-data"
    >
      <div>
        <h1 className="text-3xl font-semibold text-ink">Edit product</h1>
        <p className="text-sm text-muted">Update bilingual content, gallery, and visibility.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-semibold text-muted">
          Name (UZ)
          <input
            name="nameUz"
                defaultValue={existingProduct.nameUz}
            required
            className="w-full rounded-full border border-subtle/80 bg-surface px-4 py-3 text-sm font-medium text-ink outline-none focus:border-primary"
          />
        </label>
        <label className="space-y-2 text-sm font-semibold text-muted">
          Name (RU)
          <input
            name="nameRu"
                defaultValue={existingProduct.nameRu}
            required
            className="w-full rounded-full border border-subtle/80 bg-surface px-4 py-3 text-sm font-medium text-ink outline-none focus:border-primary"
          />
        </label>
        <label className="space-y-2 text-sm font-semibold text-muted">
          Slug
          <input
            name="slug"
                defaultValue={existingProduct.slug}
            className="w-full rounded-full border border-subtle/80 bg-surface px-4 py-3 text-sm font-medium text-ink outline-none focus:border-primary"
          />
        </label>
        <label className="space-y-2 text-sm font-semibold text-muted">
          Visibility
          <select
            name="visibility"
                defaultValue={existingProduct.visibility}
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
              defaultValue={existingProduct.categoryId}
            required
            className="w-full rounded-full border border-subtle/80 bg-surface px-4 py-3 text-sm font-medium text-ink outline-none focus:border-primary"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nameUz}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm font-semibold text-muted">
          Brand
          <select
            name="brandId"
              defaultValue={existingProduct.brandId ?? ""}
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
              defaultValue={existingProduct.descriptionUz ?? ""}
          className="w-full rounded-3xl border border-subtle/80 bg-surface px-4 py-3 text-sm text-ink outline-none focus:border-primary"
        />
      </label>

      <label className="space-y-2 text-sm font-semibold text-muted">
        Description (RU)
        <textarea
          name="descriptionRu"
          rows={3}
              defaultValue={existingProduct.descriptionRu ?? ""}
          className="w-full rounded-3xl border border-subtle/80 bg-surface px-4 py-3 text-sm text-ink outline-none focus:border-primary"
        />
      </label>

      <label className="space-y-2 text-sm font-semibold text-muted">
        Technical specifications (HTML)
        <textarea
          name="specs"
          rows={5}
              defaultValue={existingProduct.specs ?? ""}
          className="w-full rounded-3xl border border-subtle/80 bg-surface px-4 py-3 text-sm text-ink outline-none focus:border-primary"
        />
      </label>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-muted">Existing images</p>
            <div className="flex flex-wrap gap-4">
              {existingProduct.images.map((image) => (
              <label key={image.id} className="group relative block overflow-hidden rounded-[var(--radius-md)] border border-subtle/60">
                <Image
                  src={image.url}
                  alt="Product image"
                  width={192}
                  height={128}
                  className="h-32 w-48 object-cover"
                />
                <span className="absolute left-2 top-2 rounded-full bg-surface px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                  #{image.order + 1}
                </span>
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-3 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <input type="checkbox" name="removeImage" value={image.id} className="me-2" />
                  Remove
                </span>
              </label>
            ))}
          </div>
        </div>

      <label className="space-y-2 text-sm font-semibold text-muted">
        Add new images
        <input
          type="file"
          name="newImages"
          multiple
          accept="image/*"
          className="w-full rounded-full border border-subtle/80 bg-surface px-4 py-3 text-sm"
        />
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
          Update product
        </button>
      </div>
    </form>
  );
}
