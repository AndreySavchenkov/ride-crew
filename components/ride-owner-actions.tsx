"use client";

import { useTransition } from "react";
import Link from "next/link";
import { cancelRide } from "@/app/rides/actions";

export function RideOwnerActions({
  rideId,
  groupId,
}: {
  rideId: string;
  groupId: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleCancel = () => {
    if (
      !confirm(
        "Отменить эту покатушку? Это действие нельзя отменить, RSVP участников тоже удалятся."
      )
    ) {
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
        Редактировать
      </Link>
      <button
        onClick={handleCancel}
        disabled={isPending}
        className="border-2 border-destructive/40 px-4 py-2 font-label text-xs uppercase text-destructive transition-colors hover:border-destructive hover:bg-destructive/10 disabled:opacity-50"
      >
        {isPending ? "Отменяем…" : "Отменить покатушку"}
      </button>
    </div>
  );
}
