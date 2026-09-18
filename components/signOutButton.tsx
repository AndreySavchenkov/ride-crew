import { getTranslations } from "next-intl/server";
import { signOut } from "@/app/auth/actions";

export async function SignOutButton() {
  const t = await getTranslations("SignOut");

  return (
    <form action={signOut}>
      <button
        type="submit"
        className="cursor-pointer border-2 border-destructive/40 px-4 py-2 font-label text-xs uppercase text-destructive transition-colors hover:border-destructive hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {t("signOut")}
      </button>
    </form>
  );
}
