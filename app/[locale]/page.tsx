import { getUser } from "@/utils/supabase/getUser";
import { getTranslations } from "next-intl/server";
import { LiquidLink, Panel } from "@/components/plasma";

export default async function Home() {
  const user = await getUser();
  const t = await getTranslations("Home");

  // if (user) {
  //   redirect("/groups");
  // }

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 px-6 py-20">
      <Panel className="flex flex-col items-center gap-6 px-6 py-12 text-center sm:px-12">
        <p className="font-display text-[0.65rem] uppercase tracking-widest text-primary">
          {t("eyebrow")}
        </p>
        <h1 className="text-3xl leading-relaxed text-foreground">
          {t("title")}
        </h1>
        <p className="max-w-md text-muted-foreground">{t("subtitle")}</p>
      </Panel>
      <LiquidLink href="/groups/new">{t("cta")}</LiquidLink>
    </div>
  );
}
