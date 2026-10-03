import { getUser } from "@/utils/supabase/getUser";
import { SignInButton } from "./signInButton";
import { User } from "./user";
import { LocaleSwitcher } from "./locale-switcher";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { Panel } from "./plasma";

export const Header = async () => {
  const user = await getUser();
  const t = await getTranslations("Header");

  return (
    <div className="sticky top-0 z-50 px-3 pt-3 sm:px-6">
      <Panel
        as="header"
        bar
        radius={24}
        className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2.5 sm:px-5"
      >
        <div className="flex items-center gap-2.5">
          <div className="size-4 rounded-[5px] bg-primary" />
          <Link
            href="/"
            className="font-display text-xs text-foreground hover:text-primary"
          >
            {t("brand")}
          </Link>
        </div>

        <Link
          href="/groups"
          className="font-label text-sm uppercase text-muted-foreground hover:text-foreground"
        >
          {t("groups")}
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <LocaleSwitcher />
          {user ? <User user={user} /> : <SignInButton variant="inline" />}
        </div>
      </Panel>
    </div>
  );
};
