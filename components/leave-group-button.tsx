"use client";

import { useTransition } from "react";
import { leaveGroup } from "@/app/groups/actions";

export function LeaveGroupButton({ groupId }: { groupId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleLeave = () => {
    if (!confirm("Выйти из этой группы? Придётся заново вступать по коду приглашения.")) {
      return;
    }
    startTransition(() => leaveGroup(groupId));
  };

  return (
    <button
      onClick={handleLeave}
      disabled={isPending}
      className="border-2 border-destructive/40 px-4 py-2 font-label text-xs uppercase text-destructive transition-colors hover:border-destructive hover:bg-destructive/10 disabled:opacity-50"
    >
      {isPending ? "Выходим…" : "Выйти из группы"}
    </button>
  );
}
