import { getUser } from "@/utils/supabase/getUser";
import { getTranslations, getLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { joinGroup } from "@/app/groups/actions";

export default async function JoinGroupPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  const user = await getUser();
  const locale = await getLocale();
  if (!user) {
    const next = code ? `/groups/join?code=${encodeURIComponent(code)}` : "/groups/join";
    redirect(`/${locale}/login?next=${encodeURIComponent(next)}`);
  }

  const t = await getTranslations("JoinGroup");

  return (
    <div className="mx-auto max-w-md px-6 py-12">
      <h1 className="mb-2 text-2xl text-foreground">{t("title")}</h1>
      <p className="mb-8 text-muted-foreground">{t("subtitle")}</p>

      <form action={joinGroup} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="code"
            className="font-label text-xs uppercase text-muted-foreground"
          >
            {t("codeLabel")}
          </label>
          <input
            id="code"
            name="code"
            required
            defaultValue={code ?? ""}
            autoComplete="off"
            placeholder={t("codePlaceholder")}
            className="border-2 border-border bg-card px-4 py-2.5 uppercase text-foreground placeholder:normal-case placeholder:text-muted-foreground focus:border-primary focus:outline-none"
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
