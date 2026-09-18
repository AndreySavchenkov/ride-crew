"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cancelRide } from "@/app/rides/actions";

export function RideOwnerActions({
  rideId,
  groupId,
}: {
  rideId: string;
  groupId: string;
}) {
  const t = useTranslations("RideOwnerActions");
  const [isPending, startTransition] = useTransition();

  const handleCancel = () => {
    if (!confirm(t("cancelConfirm"))) {
      return;
    }
    startTransition(() => cancelRide(rideId, groupId));
  };

  return (
    <div className="flex items-center gap-3">
      <Link
        href={`/rides/${rideId}/edit`}
        className="border-2 border-border bg-card px-4 py-2 font-label text-xs uppercase text-foreground transition-colors hover:border-primary"
      >
        {t("edit")}
      </Link>
      <button
        onClick={handleCancel}
        disabled={isPending}
        className="cursor-pointer border-2 border-destructive/40 px-4 py-2 font-label text-xs uppercase text-destructive transition-colors hover:border-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? t("cancelling") : t("cancel")}
      </button>
    </div>
  );
}
