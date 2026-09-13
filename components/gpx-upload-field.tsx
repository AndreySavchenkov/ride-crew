"use client";

import { useState } from "react";
import { parseGpx } from "@/lib/gpx";
import { RouteMap } from "@/components/route-map";

type GpxUploadFieldProps = {
  initialPoints?: [number, number][];
  initialDistanceKm?: number | null;
  initialElevationGainM?: number | null;
};

// Файл читается и парсится прямо в браузере (DOMParser в lib/gpx.ts), а
// результат кладётся в скрытые поля формы — сам server action (createRide)
// остаётся обычным FormData-обработчиком, без отдельного API-роута.
//
// `initial*` пропсы — для формы редактирования: показывают уже сохранённый
// маршрут, пока юзер не загрузит новый GPX-файл ему на замену.
export function GpxUploadField({
  initialPoints = [],
  initialDistanceKm = null,
  initialElevationGainM = null,
}: GpxUploadFieldProps) {
  const [points, setPoints] = useState<[number, number][]>(initialPoints);
  const [distanceKm, setDistanceKm] = useState<number | null>(initialDistanceKm);
  const [elevationGainM, setElevationGainM] = useState<number | null>(
    initialElevationGainM
  );
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    setError(null);
    if (!file) {
      setPoints([]);
      setDistanceKm(null);
      setElevationGainM(null);
      return;
    }

    try {
      const text = await file.text();
      const parsed = parseGpx(text);
      setPoints(parsed.points);
      setDistanceKm(parsed.distanceKm);
      setElevationGainM(parsed.elevationGainM ?? null);
    } catch {
      setPoints([]);
      setDistanceKm(null);
      setElevationGainM(null);
      setError("Не удалось прочитать GPX-файл. Проверь, что это трек или маршрут.");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <label
        htmlFor="gpx"
        className="font-label text-xs uppercase text-muted-foreground"
      >
        Маршрут (GPX, необязательно)
      </label>
      <input
        id="gpx"
        name="gpx"
        type="file"
        accept=".gpx"
        onChange={(e) => handleFile(e.target.files?.[0])}
        className="border-2 border-border bg-card px-4 py-2.5 text-foreground file:mr-3 file:border-2 file:border-primary file:bg-primary file:px-3 file:py-1.5 file:font-label file:text-xs file:uppercase file:text-primary-foreground"
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      {points.length > 0 && (
        <div className="flex flex-col gap-3">
          {initialPoints.length > 0 && points === initialPoints && (
            <p className="text-sm text-muted-foreground">
              Текущий маршрут. Загрузи новый файл, чтобы заменить его.
            </p>
          )}
          <RouteMap points={points} />
          <div className="flex gap-4 font-label text-xs uppercase text-muted-foreground">
            {distanceKm !== null && <span>{distanceKm} км</span>}
            {elevationGainM !== null && <span>+{elevationGainM} м</span>}
          </div>
        </div>
      )}

      <input
        type="hidden"
        name="route_points"
        value={points.length > 0 ? JSON.stringify(points) : ""}
      />
      <input
        type="hidden"
        name="distance_km"
        value={distanceKm !== null ? String(distanceKm) : ""}
      />
      <input
        type="hidden"
        name="elevation_gain_m"
        value={elevationGainM !== null ? String(elevationGainM) : ""}
      />
    </div>
  );
}
