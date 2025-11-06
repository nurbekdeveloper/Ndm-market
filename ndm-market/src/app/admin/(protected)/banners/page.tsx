import Image from "next/image";
import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { saveUpload } from "@/lib/uploads";

export default async function AdminBannersPage() {
  const banners = await prisma.banner.findMany({ orderBy: { createdAt: "desc" } });

  async function createBanner(formData: FormData) {
    "use server";
    const linkUrl = formData.get("linkUrl")?.toString().trim() || null;
    const file = formData.get("image");

    if (!file || typeof file !== "object" || file.size === 0) {
      throw new Error("Banner image required");
    }

    const imageUrl = await saveUpload(file, "banners");

    await prisma.banner.create({
      data: {
        imageUrl,
        linkUrl,
      },
    });

    revalidatePath("/admin/banners");
  }

  async function updateBanner(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    if (!id) return;

    const linkUrl = formData.get("linkUrl")?.toString().trim() || null;
    await prisma.banner.update({
      where: { id },
      data: { linkUrl },
    });
    revalidatePath("/admin/banners");
  }

  async function deleteBanner(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    if (!id) return;

    await prisma.banner.delete({ where: { id } });
    revalidatePath("/admin/banners");
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-semibold text-ink">Homepage banners</h1>
        <p className="text-sm text-muted">Upload hero imagery for the public site.</p>
      </div>

      <form
        action={createBanner}
        className="space-y-4 rounded-[var(--radius-lg)] border border-subtle/60 bg-surface p-6 shadow-sm"
        encType="multipart/form-data"
      >
        <h2 className="text-lg font-semibold text-ink">Add new banner</h2>
        <label className="space-y-2 text-sm font-semibold text-muted">
          Banner image
          <input
            type="file"
            name="image"
            accept="image/*"
            required
            className="w-full rounded-full border border-subtle/80 bg-surface px-4 py-3 text-sm"
          />
        </label>
        <label className="space-y-2 text-sm font-semibold text-muted">
          Link (optional)
          <input
            name="linkUrl"
            placeholder="https://..."
            className="w-full rounded-full border border-subtle/80 bg-surface px-4 py-3 text-sm font-medium text-ink outline-none focus:border-primary"
          />
        </label>
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20"
          >
            Upload banner
          </button>
        </div>
      </form>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {banners.map((banner) => (
            <div key={banner.id} className="space-y-4 rounded-[var(--radius-lg)] border border-subtle/60 bg-surface p-5 shadow-sm">
            <div className="relative aspect-[3/2] overflow-hidden rounded-[var(--radius-md)] bg-subtle">
              <Image src={banner.imageUrl} alt="Banner" fill className="object-cover" />
            </div>
              <div className="space-y-3">
                <form action={updateBanner} className="space-y-3">
                  <input type="hidden" name="id" value={banner.id} />
                  <label className="space-y-2 text-sm font-semibold text-muted">
                    Link
                    <input
                      name="linkUrl"
                      defaultValue={banner.linkUrl ?? ""}
                      placeholder="https://..."
                      className="w-full rounded-full border border-subtle/80 bg-surface px-4 py-3 text-sm font-medium text-ink outline-none focus:border-primary"
                    />
                  </label>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-primary/20"
                    >
                      Save link
                    </button>
                  </div>
                </form>
                <form action={deleteBanner}>
                  <input type="hidden" name="id" value={banner.id} />
                  <button
                    type="submit"
                    className="w-full rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50"
                  >
                    Delete banner
                  </button>
                </form>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
}
