import { getUser } from "@/utils/supabase/getUser";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function Home() {
  const user = await getUser();
  const t = await getTranslations("Home");

  // if (user) {
  //   redirect("/groups");
  // }

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 py-24 text-center">
      <p className="font-display text-[0.65rem] uppercase tracking-widest text-primary">
        {t("eyebrow")}
      </p>
      <h1 className="text-3xl leading-relaxed text-foreground">
        {t("title")}
      </h1>
      <p className="max-w-md text-muted-foreground">{t("subtitle")}</p>
      <Link
        href="/groups/new"
        className="border-2 border-primary bg-primary px-6 py-3 font-label text-sm uppercase text-primary-foreground transition-colors hover:bg-background hover:text-primary"
      >
        {t("cta")}
      </Link>
    </div>
  );
}
