"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
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
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="cursor-pointer border-2 border-destructive/40 px-4 py-2 font-label text-xs uppercase text-destructive transition-colors hover:border-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? t("deleting") : t("delete")}
    </button>
  );
}
