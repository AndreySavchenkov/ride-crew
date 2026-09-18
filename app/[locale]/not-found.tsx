import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-6 py-24 text-center">
      <p className="font-display text-[0.65rem] uppercase tracking-widest text-primary">
        {t("eyebrow")}
      </p>
      <h1 className="text-2xl text-foreground">{t("title")}</h1>
      <p className="text-muted-foreground">{t("description")}</p>

      <div className="flex items-center gap-3">
        <Link
          href="/groups"
          className="border-2 border-primary bg-primary px-6 py-3 font-label text-sm uppercase text-primary-foreground transition-colors hover:bg-background hover:text-primary"
        >
          {t("myGroups")}
        </Link>
        <Link
          href="/"
          className="border-2 border-border bg-card px-6 py-3 font-label text-sm uppercase text-foreground transition-colors hover:border-primary"
        >
          {t("home")}
        </Link>
      </div>
    </div>
  );
}
