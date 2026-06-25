import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Next doesn't pick up an unrelated parent lockfile.
  turbopack: {
    root: __dirname,
  },
  // The landing now lives at "/"; keep old /landing links working.
  async redirects() {
    return [{ source: "/landing", destination: "/", permanent: true }];
  },
};

export default nextConfig;
