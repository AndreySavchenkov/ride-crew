import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const response = handleI18nRouting(request);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Важно: вызываем getUser, чтобы обновить токен, если он истёк
  await supabase.auth.getUser();

  return response;
}

export const config = {
  // `auth` is excluded because app/auth/callback/route.ts lives outside
  // app/[locale] on purpose — it's the fixed OAuth redirect target, and
  // Google doesn't know about locales — so it must never get a locale
  // prefix added/required by the i18n routing below.
  matcher: ["/((?!api|_next|_vercel|auth|.*\\..*).*)"],
};
