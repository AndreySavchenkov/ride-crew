import { getUser } from "@/utils/supabase/getUser";
import { SignInButton } from "./signInButton";
import { User } from "./user";
import Link from "next/link";

export const Header = async () => {
  const user = await getUser();

  return (
    <header className="sticky top-0 right-0 left-0 z-50 border-b-2 bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="size-4 bg-primary" />
          <Link
            href="/"
            className="font-display text-xs text-foreground hover:text-primary"
          >
            RIDE CREW
          </Link>
        </div>

        <div>
          <Link
            href="/groups"
            className="font-label text-sm uppercase text-muted-foreground hover:text-foreground"
          >
            Groups
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? <User user={user} /> : <SignInButton />}
        </div>
      </div>
    </header>
  );
};
