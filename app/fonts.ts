import { DotGothic16, Press_Start_2P, Silkscreen } from "next/font/google";

/**
 * Retro / 8-bit / 90s-anime type system.
 *
 * - `fontBody`    — DotGothic16: dot-matrix gothic, readable down to ~14px.
 *                   Used for body copy and headings (via --font-sans / --font-heading).
 * - `fontDisplay` — Press Start 2P: NES pixel face. Large, short text only
 *                   (logo, hero, big numbers). Needs generous line-height + tracking.
 * - `fontLabel`   — Silkscreen: tidy pixel caps for badges, tags, small buttons.
 */

export const fontBody = DotGothic16({
  weight: "400",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-body",
});

export const fontDisplay = Press_Start_2P({
  weight: "400",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-display",
});

export const fontLabel = Silkscreen({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-label",
});
