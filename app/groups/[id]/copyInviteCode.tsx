
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
      className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 font-mono text-sm text-white transition-colors hover:bg-white/20"
    >
      {code}
      <span className="text-xs text-white/50">
        {copied ? "Скопировано!" : "Нажми, чтобы скопировать"}
      </span>
    </button>
  );
}