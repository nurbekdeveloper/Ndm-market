import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";

export default async function AdminSettingsPage() {
  const setting = await prisma.siteSetting.findUnique({ where: { key: "languageOrder" } });
  const currentOrder = setting?.value ?? "uz,ru";

  async function updateOrder(formData: FormData) {
    "use server";
    const value = formData.get("languageOrder")?.toString() ?? "uz,ru";

    await prisma.siteSetting.upsert({
      where: { key: "languageOrder" },
      update: { value },
      create: { key: "languageOrder", value },
    });

    revalidatePath("/uz");
    revalidatePath("/ru");
    revalidatePath("/");
  }

  return (
    <div className="space-y-6 rounded-[var(--radius-lg)] border border-subtle/60 bg-surface p-6 shadow-sm">
      <div>
        <h1 className="text-3xl font-semibold text-ink">Language settings</h1>
        <p className="text-sm text-muted">Choose which locale appears first on the public website.</p>
      </div>

      <form action={updateOrder} className="space-y-4">
        <label className="flex items-center gap-3 rounded-[var(--radius-md)] border border-subtle/80 px-4 py-3 text-sm font-semibold text-ink">
          <input
            type="radio"
            name="languageOrder"
            value="uz,ru"
            defaultChecked={currentOrder === "uz,ru"}
          />
          Uzbek first, then Russian
        </label>
        <label className="flex items-center gap-3 rounded-[var(--radius-md)] border border-subtle/80 px-4 py-3 text-sm font-semibold text-ink">
          <input
            type="radio"
            name="languageOrder"
            value="ru,uz"
            defaultChecked={currentOrder === "ru,uz"}
          />
          Russian first, then Uzbek
        </label>
        <button
          type="submit"
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20"
        >
          Save preference
        </button>
      </form>
    </div>
  );
}
