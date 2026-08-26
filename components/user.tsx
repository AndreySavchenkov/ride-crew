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
      <div className="flex items-center gap-2.5 rounded-full bg-white/5 py-1.5 pl-1.5 pr-3.5">
        <Avatar className="h-7 w-7 border border-white/10">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback className="bg-[#4F9EFA] text-xs font-semibold text-[#0f1013]">
            {fallbackName}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-white">{name}</span>
      </div>
      <SignOutButton />
    </div>
  );
};
