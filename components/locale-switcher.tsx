"use client";

import { useState, useTransition } from "react";
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
  const [isPending, startTransition] = useTransition();
  const [target, setTarget] = useState<string | null>(null);

  function switchTo(code: (typeof routing.locales)[number]) {
    setTarget(code);
    startTransition(() => {
      router.replace(pathname, { locale: code });
    });
  }

  return (
    <div className="flex items-center gap-1" aria-busy={isPending}>
      {routing.locales.map((code) => (
        <button
          key={code}
          onClick={() => switchTo(code)}
          disabled={code === locale || isPending}
          className={`cursor-pointer px-1.5 py-1 font-label text-xs uppercase text-muted-foreground transition-colors hover:text-foreground disabled:cursor-default ${code === locale ? "disabled:text-foreground" : "disabled:opacity-50"}`}
        >
          {isPending && code === target ? (
            <span className="inline-block size-3 animate-spin rounded-full border-2 border-current border-t-transparent align-middle" />
          ) : (
            LOCALE_LABELS[code]
          )}
        </button>
      ))}
    </div>
  );
}
