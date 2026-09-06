import { getUser } from "@/utils/supabase/getUser";
import { SignInButton } from "./signInButton";
import { User } from "./user";
import Link from "next/link";

export const Header = async () => {
  const user = await getUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0f1013]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-[#4F9EFA]" />
          <Link href="/" className="text-white/50 hover:text-white">
            Ride Crew
          </Link>
        </div>

        <div>
          <Link href="/groups" className="text-white/50 hover:text-white">
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
