import type { NextConfig } from "next";

// Two build targets from one codebase:
//  - Web (Vercel, default): full Next.js — Route Handlers, OG image, redirects.
//  - Desktop (Tauri): TAURI_BUILD=1 → static export (no server runtime). The
//    server-only routes (app/api, opengraph-image) are physically excluded for
//    this build by scripts/desktop-export.mjs.
const isDesktop = process.env.TAURI_BUILD === "1";

const nextConfig: NextConfig = {
  // Pin the workspace root so Next doesn't pick up an unrelated parent lockfile.
  turbopack: {
    root: __dirname,
  },

  ...(isDesktop
    ? {
        output: "export" as const,
        // next/image optimization is Vercel-only and breaks static export.
        images: { unoptimized: true },
        // Emit /app as out/app/index.html so the Tauri window can load "/app".
        trailingSlash: true,
      }
    : {
        // The landing lives at "/"; keep old /landing links working (web only —
        // redirects aren't supported under output: "export").
        async redirects() {
          return [{ source: "/landing", destination: "/", permanent: true }];
        },
      }),
};

export default nextConfig;
