"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { LiquidButton, LiquidLink, Panel } from "@/components/plasma";

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
    <div className="mx-auto flex max-w-md flex-col items-center gap-8 px-6 py-20">
      <Panel className="flex w-full flex-col items-center gap-6 px-6 py-10 text-center">
        <p className="font-display text-[0.65rem] uppercase tracking-widest text-destructive">
          {t("eyebrow")}
        </p>
        <h1 className="text-2xl text-foreground">{t("title")}</h1>
        <p className="text-muted-foreground">
          {error.message || t("defaultMessage")}
        </p>
      </Panel>

      <div className="flex items-center gap-6">
        <LiquidButton onClick={retry}>{t("retry")}</LiquidButton>
        <LiquidLink href="/" tint="neutral">
          {t("home")}
        </LiquidLink>
      </div>
    </div>
  );
}
