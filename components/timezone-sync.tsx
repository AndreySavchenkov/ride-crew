"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Сервер не может узнать реальный часовой пояс зрителя сам по себе — только
// браузер это знает (Intl.DateTimeFormat().resolvedOptions().timeZone).
// Кладём его в куку один раз при заходе, чтобы серверные компоненты могли
// форматировать даты покатушек в ПОЯСЕ ЗРИТЕЛЯ, а не в поясе рантайма
// сервера (на Vercel — всегда UTC). См. utils/get-viewer-timezone.ts.
export function TimezoneSync() {
  const router = useRouter();

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const current = document.cookie
      .split("; ")
      .find((c) => c.startsWith("tz="))
      ?.split("=")[1];

    if (current !== tz) {
      document.cookie = `tz=${tz}; path=/; max-age=31536000; samesite=lax`;
      // Первый заход (или пояс поменялся, напр. в поездке) — перерендерить
      // уже открытые серверные компоненты с правильным поясом.
      router.refresh();
    }
  }, [router]);

  return null;
}
