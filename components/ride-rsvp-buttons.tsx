"use client";

import { useTransition } from "react";
import { setRsvp } from "@/app/rides/actions";
import { cn } from "@/lib/utils";

type Status = "going" | "maybe" | "not_going";

const OPTIONS: { status: Status; label: string }[] = [
  { status: "going", label: "Иду" },
  { status: "maybe", label: "Под вопросом" },
  { status: "not_going", label: "Не иду" },
];

export function RideRsvpButtons({
  rideId,
  currentStatus,
}: {
  rideId: string;
  currentStatus: Status | null;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map(({ status, label }) => {
        const active = currentStatus === status;
        return (
          <button
            key={status}
            disabled={isPending}
            onClick={() => startTransition(() => setRsvp(rideId, status))}
            className={cn(
              "border-2 px-4 py-2 font-label text-xs uppercase transition-colors disabled:opacity-50",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:border-primary"
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
