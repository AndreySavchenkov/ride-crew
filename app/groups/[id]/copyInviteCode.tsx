"use client";

import { useState } from "react";

export function CopyInviteCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 border-2 border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:border-primary"
    >
      {code}
      <span className="font-label text-xs uppercase text-muted-foreground">
        {copied ? "Скопировано!" : "Нажми, чтобы скопировать"}
      </span>
    </button>
  );
}
