"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LOCALE_LABELS: Record<(typeof routing.locales)[number], string> = {
  en: "EN",
  ru: "RU",
  pl: "PL",
};

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1">
      {routing.locales.map((code) => (
        <button
          key={code}
          onClick={() => router.replace(pathname, { locale: code })}
          disabled={code === locale}
          className="cursor-pointer px-1.5 py-1 font-label text-xs uppercase text-muted-foreground transition-colors hover:text-foreground disabled:cursor-default disabled:text-foreground"
        >
          {LOCALE_LABELS[code]}
        </button>
      ))}
    </div>
  );
}
