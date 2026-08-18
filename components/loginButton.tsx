"use client";
import { createClient } from "@/utils/supabase/client";

export const LoginButton = () => {
  const supabase = createClient();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };
  return (
    <button
      onClick={handleLogin}
      className="rounded-lg bg-black px-6 py-3 text-white"
    >
      Войти через Google
    </button>
  );
};
