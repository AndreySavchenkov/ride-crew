"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { addComment } from "@/app/rides/actions";

export function RideCommentForm({ rideId }: { rideId: string }) {
  const t = useTranslations("RideComments");
  const [body, setBody] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;

    const formData = new FormData();
    formData.set("ride_id", rideId);
    formData.set("body", body);

    startTransition(async () => {
      await addComment(formData);
      setBody("");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={2}
        placeholder={t("placeholder")}
        className="glass-field resize-none"
      />
      <button
        type="submit"
        disabled={isPending || !body.trim()}
        className="glass-button self-start border-primary/50 bg-primary/40 hover:bg-primary/60"
      >
        {isPending ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
