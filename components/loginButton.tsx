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
      className="flex items-center gap-2.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#0f1013] transition-all hover:bg-white/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F9EFA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1013]"
    >
      <svg width="18" height="18" viewBox="0 0 18 18">
        <path
          fill="#4285F4"
          d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.09-1.79 2.73v2.27h2.9c1.7-1.56 2.68-3.87 2.68-6.64z"
        />
        <path
          fill="#34A853"
          d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.27c-.8.54-1.83.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.34C2.44 15.98 5.48 18 9 18z"
        />
        <path
          fill="#FBBC05"
          d="M3.95 10.69c-.18-.54-.28-1.11-.28-1.69s.1-1.15.28-1.69V4.97H.96A8.996 8.996 0 000 9c0 1.45.35 2.83.96 4.03l2.99-2.34z"
        />
        <path
          fill="#EA4335"
          d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.97l2.99 2.34C4.66 5.17 6.65 3.58 9 3.58z"
        />
      </svg>
      Войти через Google
    </button>
  );
};