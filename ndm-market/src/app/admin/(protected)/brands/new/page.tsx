import Link from "next/link";
import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import { saveUpload } from "@/lib/uploads";
import { slugify } from "@/lib/utils";

export default function NewBrandPage() {
  async function createBrand(formData: FormData) {
    "use server";

    const nameUz = formData.get("nameUz")?.toString().trim();
    const nameRu = formData.get("nameRu")?.toString().trim();
    const slugInput = formData.get("slug")?.toString().trim();

    if (!nameUz || !nameRu) {
      throw new Error("Names are required");
    }

    let slug = slugInput || slugify(nameUz) || slugify(nameRu);
    if (!slug) {
      slug = `brand-${Date.now()}`;
    }

    const exists = await prisma.brand.findUnique({ where: { slug } });
    if (exists) {
      slug = `${slug}-${Date.now()}`;
    }

    let logoUrl: string | undefined;
    const file = formData.get("logo");
    if (file && typeof file === "object" && file.size) {
      logoUrl = await saveUpload(file, "brands");
    }

    await prisma.brand.create({
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
      action={createBrand}
      className="space-y-6 rounded-[var(--radius-lg)] border border-subtle/60 bg-surface p-6 shadow-sm"
      encType="multipart/form-data"
    >
      <div>
        <h1 className="text-3xl font-semibold text-ink">Add new brand</h1>
        <p className="text-sm text-muted">Upload the brand identity for catalog filters.</p>
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
        Brand logo
        <input
          type="file"
          name="logo"
          accept="image/*"
          className="w-full rounded-full border border-subtle/80 bg-surface px-4 py-3 text-sm"
        />
        <span className="block text-xs text-muted">Recommended square PNG / SVG.</span>
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
          Save brand
        </button>
      </div>
    </form>
  );
}
