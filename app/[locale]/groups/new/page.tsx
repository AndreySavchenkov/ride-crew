import { createGroup } from "@/app/groups/actions";
import { getUser } from "@/utils/supabase/getUser";
import { getTranslations, getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function NewGroupPage() {
  const user = await getUser();
  const locale = await getLocale();
  if (!user) redirect(`/${locale}/login?next=/groups/new`);

  const t = await getTranslations("NewGroup");

  return (
    <div className="mx-auto max-w-md px-6 py-12">
      <h1 className="mb-8 text-2xl text-foreground">{t("title")}</h1>

      <form action={createGroup} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="name"
            className="font-label text-xs uppercase text-muted-foreground"
          >
            {t("nameLabel")}
          </label>
          <input
            id="name"
            name="name"
            required
            placeholder={t("namePlaceholder")}
            className="border-2 border-border bg-card px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="description"
            className="font-label text-xs uppercase text-muted-foreground"
          >
            {t("descriptionLabel")}
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder={t("descriptionPlaceholder")}
            className="resize-none border-2 border-border bg-card px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="mt-2 cursor-pointer border-2 border-primary bg-primary px-6 py-3 font-label text-sm uppercase text-primary-foreground transition-colors hover:bg-background hover:text-primary"
        >
          {t("submit")}
        </button>
      </form>
    </div>
  );
}
