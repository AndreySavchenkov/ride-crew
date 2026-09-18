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
        className="resize-none border-2 border-border bg-card px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
      />
      <button
        type="submit"
        disabled={isPending || !body.trim()}
        className="cursor-pointer self-start border-2 border-primary bg-primary px-4 py-2 font-label text-xs uppercase text-primary-foreground transition-colors hover:bg-background hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
