"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { leaveGroup } from "@/app/groups/actions";

export function LeaveGroupButton({ groupId }: { groupId: string }) {
  const t = useTranslations("LeaveGroupButton");
  const [isPending, startTransition] = useTransition();

  const handleLeave = () => {
    if (!confirm(t("confirm"))) {
      return;
    }
    startTransition(() => leaveGroup(groupId));
  };

  return (
    <button
      onClick={handleLeave}
      disabled={isPending}
      className="cursor-pointer border-2 border-destructive/40 px-4 py-2 font-label text-xs uppercase text-destructive transition-colors hover:border-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? t("leaving") : t("leave")}
    </button>
  );
}
