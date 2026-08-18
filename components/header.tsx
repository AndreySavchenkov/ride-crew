import { LoginButton } from "./loginButton";
import { User } from "./user";
import { createClient } from "@/utils/supabase/server";

export const Header = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <header className="flex">{user ? <User /> : <LoginButton />}</header>;
};
