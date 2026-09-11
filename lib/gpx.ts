// Минимальный клиентский парсер GPX: без сторонних зависимостей, только DOMParser.
// Берёт трек (trkpt) или, если его нет, маршрут (rtept), прореживает точки для
// компактного превью-рендера и считает дистанцию/набор высоты вручную.

export type ParsedGpx = {
  points: [number, number][]; // [lat, lng]
  distanceKm: number;
  elevationGainM?: number;
};

const MAX_POINTS = 200;

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function haversineKm(a: [number, number], b: [number, number]) {
  const R = 6371;
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

function decimate<T>(items: T[], maxLength: number): T[] {
  if (items.length <= maxLength) return items;
  const step = items.length / maxLength;
  const result: T[] = [];
  for (let i = 0; i < maxLength; i++) {
    result.push(items[Math.floor(i * step)]);
  }
  // всегда сохраняем последнюю точку, чтобы маршрут не обрывался раньше времени
  result[result.length - 1] = items[items.length - 1];
  return result;
}

export function parseGpx(xmlText: string): ParsedGpx {
  const doc = new DOMParser().parseFromString(xmlText, "application/xml");

  if (doc.querySelector("parsererror")) {
    throw new Error("Не удалось прочитать GPX-файл");
  }

  let nodes = Array.from(doc.getElementsByTagName("trkpt"));
  if (nodes.length === 0) {
    nodes = Array.from(doc.getElementsByTagName("rtept"));
  }
  if (nodes.length === 0) {
    throw new Error("В файле не найден трек или маршрут");
  }

  const raw: { point: [number, number]; ele?: number }[] = nodes.map((n) => {
    const lat = parseFloat(n.getAttribute("lat") ?? "");
    const lon = parseFloat(n.getAttribute("lon") ?? "");
    const eleNode = n.getElementsByTagName("ele")[0];
    const ele = eleNode ? parseFloat(eleNode.textContent ?? "") : undefined;
    return { point: [lat, lon], ele: Number.isFinite(ele) ? ele : undefined };
  });

  // дистанцию и набор высоты считаем по полному треку, до прореживания
  let distanceKm = 0;
  let elevationGainM = 0;
  let hasElevation = false;

  for (let i = 1; i < raw.length; i++) {
    distanceKm += haversineKm(raw[i - 1].point, raw[i].point);
    const prevEle = raw[i - 1].ele;
    const ele = raw[i].ele;
    if (prevEle !== undefined && ele !== undefined) {
      hasElevation = true;
      if (ele > prevEle) elevationGainM += ele - prevEle;
    }
  }

  const points = decimate(
    raw.map((r) => r.point),
    MAX_POINTS
  );

  return {
    points,
    distanceKm: Math.round(distanceKm * 10) / 10,
    elevationGainM: hasElevation ? Math.round(elevationGainM) : undefined,
  };
}
