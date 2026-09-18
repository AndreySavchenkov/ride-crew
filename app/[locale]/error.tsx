"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const t = useTranslations("ErrorPage");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-6 py-24 text-center">
      <p className="font-display text-[0.65rem] uppercase tracking-widest text-destructive">
        {t("eyebrow")}
      </p>
      <h1 className="text-2xl text-foreground">{t("title")}</h1>
      <p className="text-muted-foreground">
        {error.message || t("defaultMessage")}
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={retry}
          className="cursor-pointer border-2 border-primary bg-primary px-6 py-3 font-label text-sm uppercase text-primary-foreground transition-colors hover:bg-background hover:text-primary"
        >
          {t("retry")}
        </button>
        <Link
          href="/"
          className="border-2 border-border bg-card px-6 py-3 font-label text-sm uppercase text-foreground transition-colors hover:border-primary"
        >
          {t("home")}
        </Link>
      </div>
    </div>
  );
}
