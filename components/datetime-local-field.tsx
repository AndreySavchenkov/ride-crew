"use client";

import { useEffect, useId, useState } from "react";

// `datetime-local` отдаёт голую строку без часового пояса ("2026-09-20T18:00").
// Если отдать её серверу как есть и сделать new Date(...) там, JS применит
// часовой пояс СЕРВЕРА (на Vercel — UTC), а не реальный пояс организатора.
// Поэтому конвертацию в абсолютный момент времени делаем прямо в браузере,
// где new Date(...) корректно использует настоящее смещение зрителя, и уже
// готовый ISO-момент кладём в скрытое поле — сервер его просто сохраняет,
// не переинтерпретируя.
function toIsoFromLocalInput(localValue: string): string {
  if (!localValue) return "";
  const d = new Date(localValue);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString();
}

// Обратное преобразование — для формы редактирования: из абсолютного ISO
// момента получаем строку для самого поля в РЕАЛЬНОМ локальном поясе
// браузера. Это тоже можно посчитать только на клиенте (сервер не знает,
// в каком поясе находится зритель), поэтому в useEffect, а не при рендере —
// иначе будет hydration mismatch между SSR (пояс сервера) и клиентом.
function toLocalInputFromIso(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export function DateTimeLocalField({
  name = "starts_at",
  label = "Дата и время",
  defaultValueIso,
  required = true,
}: {
  name?: string;
  label?: string;
  defaultValueIso?: string;
  required?: boolean;
}) {
  const id = useId();
  const [localValue, setLocalValue] = useState("");

  useEffect(() => {
    if (defaultValueIso) {
      setLocalValue(toLocalInputFromIso(defaultValueIso));
    }
  }, [defaultValueIso]);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-label text-xs uppercase text-muted-foreground">
        {label}
      </label>
      <input
        id={id}
        type="datetime-local"
        required={required}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="border-2 border-border bg-card px-4 py-2.5 text-foreground focus:border-primary focus:outline-none"
      />
      <input type="hidden" name={name} value={toIsoFromLocalInput(localValue)} />
    </div>
  );
}
