"use client";

import { useState } from "react";

export function CopyInviteCode({ code }: { code: string }) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = async () => {
    const link = `${location.origin}/groups/join?code=${encodeURIComponent(code)}`;
    await navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={handleCopyCode}
        className="flex items-center gap-2 border-2 border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:border-primary"
      >
        {code}
        <span className="font-label text-xs uppercase text-muted-foreground">
          {copiedCode ? "Скопировано!" : "Скопировать код"}
        </span>
      </button>
      <button
        onClick={handleCopyLink}
        className="border-2 border-border bg-card px-4 py-2 font-label text-xs uppercase text-foreground transition-colors hover:border-primary"
      >
        {copiedLink ? "Скопировано!" : "Скопировать ссылку"}
      </button>
    </div>
  );
}
