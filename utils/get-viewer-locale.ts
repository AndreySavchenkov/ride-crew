import { cookies } from "next/headers";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";

// Server Actions can't read the `[locale]` route param (next/root-params
// doesn't resolve there), so we fall back to the `NEXT_LOCALE` cookie that
// next-intl's proxy sets on every request — see i18n/routing.ts.
export async function getViewerLocale() {
  const store = await cookies();
  const locale = store.get("NEXT_LOCALE")?.value;
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}
