import type { Metadata, Viewport } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { fontBody, fontDisplay, fontLabel } from "./fonts";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const viewport: Viewport = {
  themeColor: "#0f1013",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: { default: "Ride Crew", template: "%s · Ride Crew" },
  description: "ride with friends",
  openGraph: {
    title: "Ride Crew",
    description: "ride with friends",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "dark",
        "h-full",
        "antialiased",
        fontBody.variable,
        fontDisplay.variable,
        fontLabel.variable,
      )}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
