"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { LiquidButton } from "@/components/plasma";
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
    <LiquidButton
      tint="destructive"
      strength={0.35}
      size="sm"
      onClick={handleLeave}
      disabled={isPending}
      className="shrink-0"
    >
      {isPending ? t("leaving") : t("leave")}
    </LiquidButton>
  );
}
