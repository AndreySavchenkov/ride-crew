import { getTranslations } from "next-intl/server";
import { UserMenu } from "./user-menu";
import { SignOutButton } from "./signOutButton";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export const User = async ({ user }: { user: SupabaseUser }) => {
  const t = await getTranslations("User");
  const name = user.user_metadata.name ?? user.email ?? t("defaultName");
  const image = user.user_metadata.avatar_url;
  const fallbackName = name
    .split(" ")
    .map((part: string) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <UserMenu name={name} avatarUrl={image} fallbackName={fallbackName}>
      <SignOutButton />
    </UserMenu>
  );
};
