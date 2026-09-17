"use client";

import { useTransition } from "react";
import { setRsvp } from "@/app/rides/actions";
import { cn } from "@/lib/utils";

type Status = "going" | "maybe" | "not_going";

const OPTIONS: {
  status: Status;
  label: string;
  activeClassName: string;
  hoverClassName: string;
}[] = [
  {
    status: "going",
    label: "Иду",
    activeClassName: "border-emerald-500 bg-emerald-500 text-white",
    hoverClassName: "hover:border-emerald-500",
  },
  {
    status: "maybe",
    label: "Под вопросом",
    activeClassName: "border-amber-500 bg-amber-500 text-white",
    hoverClassName: "hover:border-amber-500",
  },
  {
    status: "not_going",
    label: "Не иду",
    activeClassName: "border-red-500 bg-red-500 text-white",
    hoverClassName: "hover:border-red-500",
  },
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
      {OPTIONS.map(({ status, label, activeClassName, hoverClassName }) => {
        const active = currentStatus === status;
        return (
          <button
            key={status}
            disabled={isPending}
            onClick={() => startTransition(() => setRsvp(rideId, status))}
            className={cn(
              "cursor-pointer border-2 px-4 py-2 font-label text-xs uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-50",
              active
                ? activeClassName
                : cn("border-border bg-card text-foreground", hoverClassName)
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
