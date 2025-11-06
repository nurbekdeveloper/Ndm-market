import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import { saveUpload } from "@/lib/uploads";
import { slugify } from "@/lib/utils";

interface EditBrandPageProps {
  params: { id: string };
}

export default async function EditBrandPage({ params }: EditBrandPageProps) {
  const id = Number(params.id);
  if (!id) {
    redirect("/admin/brands");
  }

  const brand = await prisma.brand.findUnique({ where: { id } });
  if (!brand) {
    redirect("/admin/brands");
  }
  const existingBrand = brand;

  async function updateBrand(formData: FormData) {
    "use server";
    const nameUz = formData.get("nameUz")?.toString().trim();
    const nameRu = formData.get("nameRu")?.toString().trim();
    const slugInput = formData.get("slug")?.toString().trim();
    const removeLogo = formData.get("removeLogo")?.toString() === "on";
    const file = formData.get("logo");

    if (!nameUz || !nameRu) {
      throw new Error("Names are required");
    }

    let slug = slugInput || slugify(nameUz) || slugify(nameRu) || existingBrand.slug;
    if (slug !== existingBrand.slug) {
      const exists = await prisma.brand.findUnique({ where: { slug } });
      if (exists && exists.id !== existingBrand.id) slug = `${slug}-${existingBrand.id}`;
    }

    let logoUrl = existingBrand.logoUrl ?? undefined;
    if (file && typeof file === "object" && file.size) {
      logoUrl = await saveUpload(file, "brands");
    } else if (removeLogo) {
      logoUrl = undefined;
    }

    await prisma.brand.update({
      where: { id: existingBrand.id },
      data: {
        nameUz,
        nameRu,
        slug,
        logoUrl,
      },
    });

    redirect("/admin/brands");
  }

  return (
    <form
      action={updateBrand}
      className="space-y-6 rounded-[var(--radius-lg)] border border-subtle/60 bg-surface p-6 shadow-sm"
      encType="multipart/form-data"
    >
      <div>
        <h1 className="text-3xl font-semibold text-ink">Edit brand</h1>
        <p className="text-sm text-muted">Update bilingual names and logo.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-semibold text-muted">
          Name (UZ)
          <input
            name="nameUz"
            defaultValue={existingBrand.nameUz}
            required
            className="w-full rounded-full border border-subtle/80 bg-surface px-4 py-3 text-sm font-medium text-ink outline-none focus:border-primary"
          />
        </label>
        <label className="space-y-2 text-sm font-semibold text-muted">
          Name (RU)
          <input
            name="nameRu"
            defaultValue={existingBrand.nameRu}
            required
            className="w-full rounded-full border border-subtle/80 bg-surface px-4 py-3 text-sm font-medium text-ink outline-none focus:border-primary"
          />
        </label>
        <label className="space-y-2 text-sm font-semibold text-muted">
          Slug
          <input
            name="slug"
            defaultValue={existingBrand.slug}
            className="w-full rounded-full border border-subtle/80 bg-surface px-4 py-3 text-sm font-medium text-ink outline-none focus:border-primary"
          />
        </label>
      </div>

        <div className="space-y-2 text-sm font-semibold text-muted">
          <span>Current logo</span>
          {existingBrand.logoUrl ? (
            <div className="flex items-center gap-4">
              <Image
                src={existingBrand.logoUrl}
                alt={existingBrand.nameUz}
                width={96}
                height={96}
                className="h-24 w-24 rounded-[var(--radius-md)] object-cover"
              />
              <label className="flex items-center gap-2 text-xs font-semibold text-muted">
                <input type="checkbox" name="removeLogo" /> Remove logo
              </label>
            </div>
          ) : (
            <p className="text-xs text-muted">No logo uploaded yet.</p>
          )}
        </div>

        <label className="space-y-2 text-sm font-semibold text-muted">
          Replace logo
          <input
            type="file"
            name="logo"
            accept="image/*"
            className="w-full rounded-full border border-subtle/80 bg-surface px-4 py-3 text-sm"
          />
        </label>

        <div className="flex justify-end gap-3 pt-4">
          <Link
            href="/admin/brands"
            className="rounded-full border border-subtle/80 px-5 py-3 text-sm font-semibold text-muted hover:border-primary hover:text-primary"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20"
          >
            Update brand
          </button>
        </div>
    </form>
  );
}
