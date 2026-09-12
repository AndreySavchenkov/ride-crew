"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-6 py-24 text-center">
      <p className="font-display text-[0.65rem] uppercase tracking-widest text-destructive">
        Упс
      </p>
      <h1 className="text-2xl text-foreground">Что-то пошло не так</h1>
      <p className="text-muted-foreground">
        {error.message || "Не удалось выполнить запрос. Попробуй ещё раз."}
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={retry}
          className="border-2 border-primary bg-primary px-6 py-3 font-label text-sm uppercase text-primary-foreground transition-colors hover:bg-background hover:text-primary"
        >
          Попробовать снова
        </button>
        <Link
          href="/"
          className="border-2 border-border bg-card px-6 py-3 font-label text-sm uppercase text-foreground transition-colors hover:border-primary"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}
