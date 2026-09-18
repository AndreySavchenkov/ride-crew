"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("RemoveMemberButton");
  const [isPending, startTransition] = useTransition();

  const handleRemove = () => {
    if (!confirm(t("confirm", { name: memberName }))) {
      return;
    }
    startTransition(() => removeMember(groupId, userId));
  };

  return (
    <button
      onClick={handleRemove}
      disabled={isPending}
      className="ml-auto cursor-pointer font-label text-xs uppercase text-muted-foreground transition-colors hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? t("removing") : t("remove")}
    </button>
  );
}
