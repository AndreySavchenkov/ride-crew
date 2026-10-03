"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { LiquidButton } from "@/components/plasma";
import { deleteGroup } from "@/app/groups/actions";

export function DeleteGroupButton({ groupId }: { groupId: string }) {
  const t = useTranslations("DeleteGroupButton");
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(t("confirm"))) {
      return;
    }
    startTransition(() => deleteGroup(groupId));
  };

  return (
    <LiquidButton
      tint="destructive"
      strength={0.35}
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
      className="shrink-0"
    >
      {isPending ? t("deleting") : t("delete")}
    </LiquidButton>
  );
}
