"use client";

import Script from "next/script";
import { site } from "@/lib/site";

// Ko-fi's official floating overlay. The script defines a global and doesn't
// auto-init under bundlers, so we call draw() in onLoad. Positioned bottom-left
// so it never sits on top of the mobile download CTA (which is bottom/centered).
export function KofiFloat() {
  return (
    <Script
      src="https://storage.ko-fi.com/cdn/scripts/overlay-widget.js"
      strategy="afterInteractive"
      onLoad={() => {
        const w = window as unknown as {
          kofiWidgetOverlay?: {
            draw: (user: string, opts: Record<string, string>) => void;
          };
        };
        w.kofiWidgetOverlay?.draw(site.kofiUser, {
          type: "floating-chat",
          "floating-chat.donateButton.text": "Support Scrapable",
          "floating-chat.donateButton.background-color": "#7c4dff",
          "floating-chat.donateButton.text-color": "#ffffff",
        });
      }}
    />
  );
}
