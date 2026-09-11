"use client";

import { useEffect, useRef } from "react";
import type { Map as MapLibreMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { cn } from "@/lib/utils";

// maplibre-gl трогает window/WebGL при создании карты, поэтому сама
// библиотека импортируется динамически внутри useEffect — так компонент
// не падает при серверном пререндере клиентских компонентов.

type RouteMapProps = {
  points: [number, number][]; // [lat, lng]
  className?: string;
};

export function RouteMap({ points, className }: RouteMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  useEffect(() => {
    if (!containerRef.current || points.length === 0) return;

    let cancelled = false;
    const markers: import("maplibre-gl").Marker[] = [];

    import("maplibre-gl").then((maplibregl) => {
      if (cancelled || !containerRef.current) return;

      // Turbopack ломает относительный import воркера maplibre-gl на
      // maplibre-gl-shared.mjs (воркер создаётся и тут же падает, тайлы
      // никогда не грузятся — карта остаётся пустой). Поэтому подсовываем
      // ему статичную, нетронутую бандлером копию из public/maplibre —
      // при обновлении maplibre-gl файлы нужно скопировать заново из
      // node_modules/maplibre-gl/dist/{maplibre-gl-worker,maplibre-gl-shared}.mjs.
      maplibregl.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

      // OpenFreeMap отдаёт только "positron"/"liberty"/"bright" — тёмного
      // варианта у них нет ("dark-matter" 404-ит). Берём один светлый стиль
      // для обеих тем и приглушаем его CSS-фильтром (см. className ниже) —
      // так карта не спорит с тёмной темой, но и не требует своего JSON-стиля.
      const styleUrl = "https://tiles.openfreemap.org/styles/positron";
      const routeColor = "#1f6f57";

      const lngLats: [number, number][] = points.map(([lat, lng]) => [
        lng,
        lat,
      ]);

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: styleUrl,
        interactive: true,
        attributionControl: false,
      });
      mapRef.current = map;

      map.on("load", () => {
        if (cancelled) return;

        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: { type: "LineString", coordinates: lngLats },
          },
        });

        map.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          layout: { "line-cap": "round", "line-join": "round" },
          paint: { "line-color": routeColor, "line-width": 3 },
        });

        const bounds = lngLats.reduce(
          (b, coord) => b.extend(coord),
          new maplibregl.LngLatBounds(lngLats[0], lngLats[0])
        );
        map.fitBounds(bounds, { padding: 32, duration: 0 });

        const addSquareMarker = (lngLat: [number, number]) => {
          const el = document.createElement("div");
          el.style.width = "10px";
          el.style.height = "10px";
          el.style.background = routeColor;
          el.style.border = "2px solid #ffffff";
          const marker = new maplibregl.Marker({
            element: el,
            anchor: "center",
          })
            .setLngLat(lngLat)
            .addTo(map);
          markers.push(marker);
        };

        addSquareMarker(lngLats[0]);
        if (lngLats.length > 1) {
          addSquareMarker(lngLats[lngLats.length - 1]);
        }
      });
    });

    return () => {
      cancelled = true;
      markers.forEach((m) => m.remove());
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [points]);

  if (points.length === 0) return null;

  return (
    <div
      data-slot="route-map"
      className={cn(
        "h-56 w-full overflow-hidden border-2 border-border grayscale-[40%] contrast-[1.05]",
        className
      )}
    >
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
