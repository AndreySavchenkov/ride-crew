import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ride Crew",
    short_name: "Ride Crew",
    description: "ride with friends",
    start_url: "/",
    display: "standalone",
    background_color: "#0f1013",
    theme_color: "#0f1013",
    icons: [
      { src: "/pwa-icon/192.png", sizes: "192x192", type: "image/png" },
      { src: "/pwa-icon/512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/pwa-icon/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
