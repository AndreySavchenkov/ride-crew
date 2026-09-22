import { Inter, Press_Start_2P } from "next/font/google";

/**
 * Retro accent (logo/hero) over a modern, legible UI face.
 *
 * - `fontBody`    — Inter: modern UI face, readable at small sizes across
 *                   latin, latin-ext (Polish diacritics) and cyrillic (Russian).
 *                   Used for body copy and headings (via --font-sans / --font-heading).
 * - `fontDisplay` — Press Start 2P: NES pixel face. Large, short text only
 *                   (logo, hero, big numbers). Needs generous line-height + tracking.
 * - `fontLabel`   — Inter Semi/Bold: badges, tags, small buttons. Was Silkscreen,
 *                   then Pixelify Sans, but pixel faces read poorly at these small
 *                   uppercase sizes — plain bold Inter is clearer and still stands
 *                   apart from body copy via weight + letter-spacing (see
 *                   `.font-label` in globals.css).
 */

export const fontBody = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  variable: "--font-body",
});

export const fontDisplay = Press_Start_2P({
  weight: "400",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  variable: "--font-display",
});

export const fontLabel = Inter({
  weight: ["600", "700"],
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  variable: "--font-label",
});
