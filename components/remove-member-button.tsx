"use client";

import { useTransition } from "react";
import { removeMember } from "@/app/groups/actions";

export function RemoveMemberButton({
  groupId,
  userId,
  memberName,
}: {
  groupId: string;
  userId: string;
  memberName: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleRemove = () => {
    if (!confirm(`Убрать ${memberName} из группы?`)) {
      return;
    }
    startTransition(() => removeMember(groupId, userId));
  };

  return (
    <button
      onClick={handleRemove}
      disabled={isPending}
      className="ml-auto font-label text-xs uppercase text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
    >
      {isPending ? "Убираем…" : "Убрать"}
    </button>
  );
}
