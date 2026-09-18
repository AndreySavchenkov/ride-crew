import { getTranslations } from "next-intl/server";
import { signOut } from "@/app/auth/actions";

export async function SignOutButton() {
  const t = await getTranslations("SignOut");

  return (
    <form action={signOut} className="w-full">
      <button
        type="submit"
        className="w-full cursor-pointer px-3 py-2 text-left font-label text-xs uppercase text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
      >
        {t("signOut")}
      </button>
    </form>
  );
}
