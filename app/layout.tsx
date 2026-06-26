import type { Metadata } from "next";
import {
  Caveat,
  Quicksand,
  Patrick_Hand,
  Nunito,
  Playfair_Display,
  Inter,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

// One font per role across the four mood presets. The active preset maps
// --font-display/--font-body to the right pair (see globals.css).

// cozy
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"] });
const quicksand = Quicksand({ variable: "--font-quicksand", subsets: ["latin"] });
// playful-y2k
const patrick = Patrick_Hand({
  variable: "--font-patrick",
  weight: "400",
  subsets: ["latin"],
});
const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"] });
// dark-academia (display) + minimal-clean / academia body
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

const fontVars = [
  caveat.variable,
  quicksand.variable,
  patrick.variable,
  nunito.variable,
  playfair.variable,
  inter.variable,
].join(" ");

export const metadata: Metadata = {
  metadataBase: new URL("https://scrapable.app"),
  title: "Scrapable — your pins become the interface",
  description:
    "A to-do + notes app whose entire look is generated from your Pinterest inspiration.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-preset="cozy" className={`${fontVars} h-full antialiased`}>
      <body className="min-h-full">
        {children}
        {/* Vercel Web Analytics + Speed Insights (web only; no-op in Tauri). */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
