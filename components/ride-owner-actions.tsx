"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { LiquidButton, LiquidLink } from "@/components/plasma";
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
    // gap-6 — больше blend-дистанции, иначе две кнопки сольются в одну каплю.
    <div className="flex shrink-0 items-center gap-6">
      <LiquidLink tint="neutral" size="sm" href={`/rides/${rideId}/edit`}>
        {t("edit")}
      </LiquidLink>
      <LiquidButton
        tint="destructive"
        strength={0.35}
        size="sm"
        onClick={handleCancel}
        disabled={isPending}
      >
        {isPending ? t("cancelling") : t("cancel")}
      </LiquidButton>
    </div>
  );
}
