import { createGroup } from "@/app/groups/actions";
import { getUser } from "@/utils/supabase/getUser";
import { getTranslations, getLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { LiquidButton, Panel } from "@/components/plasma";

export default async function NewGroupPage() {
  const user = await getUser();
  const locale = await getLocale();
  if (!user) redirect(`/${locale}/login?next=/groups/new`);

  const t = await getTranslations("NewGroup");

  return (
    <div className="mx-auto max-w-md px-6 py-12">
      <h1 className="mb-8 text-2xl text-foreground">{t("title")}</h1>

      <form action={createGroup} className="flex flex-col gap-6">
        <Panel className="flex flex-col gap-5 p-5 sm:p-6">
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
              className="glass-field"
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
              className="glass-field resize-none"
            />
          </div>
        </Panel>

        <LiquidButton type="submit">{t("submit")}</LiquidButton>
      </form>
    </div>
  );
}
