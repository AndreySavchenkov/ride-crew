"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { deleteComment } from "@/app/rides/actions";

export function DeleteCommentButton({
  commentId,
  rideId,
}: {
  commentId: string;
  rideId: string;
}) {
  const t = useTranslations("RideComments");
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => deleteComment(commentId, rideId))}
      disabled={isPending}
      className="cursor-pointer font-label text-xs uppercase text-muted-foreground transition-colors hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? t("deleting") : t("delete")}
    </button>
  );
}
