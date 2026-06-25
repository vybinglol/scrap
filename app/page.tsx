import type { Metadata } from "next";
import { LandingShell } from "@/components/landing/LandingShell";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Problem } from "@/components/landing/Problem";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { TransformShowcase } from "@/components/landing/TransformShowcase";
import { SupportKofi } from "@/components/landing/SupportKofi";
import { DownloadSection } from "@/components/landing/DownloadSection";
import { Faq } from "@/components/landing/Faq";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Scrapable — a to-do + notes app that becomes your aesthetic",
  description:
    "Scrapable turns your Pinterest inspiration into your app's actual look — colors, mood, fonts and doodles. To-dos + voice notes that become you. Free for Mac.",
  openGraph: {
    title: "Scrapable — your pins become the interface",
    description:
      "A to-do + notes app whose entire look is generated from your Pinterest inspiration. Free for Mac.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scrapable — your pins become the interface",
    description:
      "A to-do + notes app that becomes your aesthetic. Free for Mac.",
  },
};

export default function LandingPage() {
  return (
    <LandingShell>
      <div id="top">
        <Nav />
        <main>
          <Hero />
          <Problem />
          <HowItWorks />
          <Features />
          <TransformShowcase />
          <SupportKofi />
          <DownloadSection />
          <Faq />
        </main>
        <Footer />
      </div>
    </LandingShell>
  );
}
