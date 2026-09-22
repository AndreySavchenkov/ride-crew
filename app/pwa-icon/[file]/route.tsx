import { ImageResponse } from "next/og";

// Filenames carry a dot (e.g. "192.png") so proxy.ts skips locale routing.
const ICONS: Record<string, { size: number; maskable: boolean }> = {
  "180.png": { size: 180, maskable: false },
  "192.png": { size: 192, maskable: false },
  "512.png": { size: 512, maskable: false },
  "maskable-512.png": { size: 512, maskable: true },
};

// Same pixel-art tyre as app/[locale]/icon.svg.
const cells: [number, number, number, number][] = [
  [8, 0, 16, 4], [4, 4, 4, 4], [24, 4, 4, 4], [0, 8, 4, 16], [28, 8, 4, 16],
  [4, 24, 4, 4], [24, 24, 4, 4], [8, 28, 16, 4], [12, 12, 8, 8],
  [14, 4, 4, 8], [14, 20, 4, 8], [4, 14, 8, 4], [20, 14, 8, 4],
];

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" shape-rendering="crispEdges"><g fill="#4ade80">${cells
  .map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`)
  .join("")}</g></svg>`;
const src = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

export function generateStaticParams() {
  return Object.keys(ICONS).map((file) => ({ file }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  const icon = ICONS[file];
  if (!icon) return new Response("Not found", { status: 404 });

  // Maskable icons keep the artwork inside the central 80% safe zone.
  const art = Math.round(icon.size * (icon.maskable ? 0.6 : 0.8));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f1013",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={art} height={art} alt="" />
      </div>
    ),
    { width: icon.size, height: icon.size },
  );
}
