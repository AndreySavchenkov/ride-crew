import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SignOutButton } from "./signOutButton";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export const User = ({ user }: { user: SupabaseUser }) => {
  const name = user.user_metadata.name ?? user.email ?? "Пользователь";
  const image = user.user_metadata.avatar_url;
  const fallbackName = name
    .split(" ")
    .map((part: string) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2.5 border-2 border-border bg-card py-1.5 pr-3.5 pl-1.5">
        <Avatar className="size-7 rounded-none border border-border">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback className="rounded-none bg-primary font-label text-xs text-primary-foreground">
            {fallbackName}
          </AvatarFallback>
        </Avatar>
        <span className="font-label text-xs uppercase text-foreground">
          {name}
        </span>
      </div>
      <SignOutButton />
    </div>
  );
};
