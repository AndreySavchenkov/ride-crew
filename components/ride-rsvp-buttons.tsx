"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { setRsvp } from "@/app/rides/actions";
import { LiquidButton, type Tint } from "@/components/plasma";

type Status = "going" | "maybe" | "not_going";

const OPTIONS: { status: Status; tint: Tint; labelKey: "going" | "maybe" | "notGoing" }[] = [
  { status: "going", tint: "going", labelKey: "going" },
  { status: "maybe", tint: "maybe", labelKey: "maybe" },
  { status: "not_going", tint: "notGoing", labelKey: "notGoing" },
];

export function RideRsvpButtons({
  rideId,
  currentStatus,
}: {
  rideId: string;
  currentStatus: Status | null;
}) {
  const t = useTranslations("RideRsvp");
  const [isPending, startTransition] = useTransition();

  return (
    // gap-6 — больше blend-дистанции, чтобы кнопки не слипались.
    <div className="flex flex-wrap gap-6">
      {OPTIONS.map(({ status, tint, labelKey }) => {
        const active = currentStatus === status;
        return (
          <LiquidButton
            key={status}
            tint={tint}
            // Выбранный ответ — насыщенный цвет, остальные — лёгкий оттенок.
            strength={active ? 0.75 : 0.12}
            size="sm"
            aria-pressed={active}
            disabled={isPending}
            onClick={() => startTransition(() => setRsvp(rideId, status))}
          >
            {t(labelKey)}
          </LiquidButton>
        );
      })}
    </div>
  );
}
