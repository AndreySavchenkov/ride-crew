import { getTranslations } from "next-intl/server";
import { LiquidLink, Panel } from "@/components/plasma";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-8 px-6 py-20">
      <Panel className="flex w-full flex-col items-center gap-6 px-6 py-10 text-center">
        <p className="font-display text-[0.65rem] uppercase tracking-widest text-primary">
          {t("eyebrow")}
        </p>
        <h1 className="text-2xl text-foreground">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </Panel>

      <div className="flex items-center gap-6">
        <LiquidLink href="/groups">{t("myGroups")}</LiquidLink>
        <LiquidLink href="/" tint="neutral">
          {t("home")}
        </LiquidLink>
      </div>
    </div>
  );
}
