import { getUser } from "@/utils/supabase/getUser";
import { getTranslations, getLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { SignInButton } from "@/components/signInButton";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  // Same-origin-only guard, mirrored from the callback route.
  const safeNext = next?.startsWith("/") && !next.startsWith("//") ? next : undefined;

  const user = await getUser();
  const locale = await getLocale();
  if (user) redirect(`/${locale}${safeNext ?? "/groups"}`);

  const t = await getTranslations("Login");

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-6 py-24 text-center">
      <p className="font-display text-[0.65rem] uppercase tracking-widest text-primary">
        {t("eyebrow")}
      </p>
      <h1 className="text-2xl text-foreground">{t("heading")}</h1>
      <p className="text-muted-foreground">{t("subtitle")}</p>
      <SignInButton next={safeNext} />
    </div>
  );
}
