"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";

export function CopyInviteCode({ code }: { code: string }) {
  const t = useTranslations("CopyInviteCode");
  const locale = useLocale();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = async () => {
    const link = `${location.origin}/${locale}/groups/join?code=${encodeURIComponent(code)}`;
    await navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={handleCopyCode}
        className="glass-button text-sm normal-case"
      >
        {code}
        <span className="font-label text-xs uppercase text-muted-foreground">
          {copiedCode ? t("copied") : t("copyCode")}
        </span>
      </button>
      <button
        onClick={handleCopyLink}
        className="glass-button"
      >
        {copiedLink ? t("copied") : t("copyLink")}
      </button>
    </div>
  );
}
