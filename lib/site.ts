// One place to edit everything marketing-facing. Drop the real GitHub Release
// .dmg URL into DOWNLOAD_URL when the Tauri build is published.

export const site = {
  name: "Scrapable",
  tagline: "Your to-do list, but make it yours.",

  // The browser web app (this same repo, served at "/").
  webAppPath: "/",

  // Ko-fi (handle stays "vybinglol").
  kofiUser: "vybinglol",
  kofiUrl: "https://ko-fi.com/vybinglol",

  // Mac download. Replace with the real GitHub Releases .dmg asset URL.
  // TODO(jorge): paste the published universal .dmg URL here.
  downloadUrl: "#download", // PLACEHOLDER — see README "Mac build"
  githubUrl: "https://github.com/vybinglol/scrapable",

  // Shown near the download button. Update to match the published build.
  version: "0.1.0",
  fileSize: "8.4 MB",
  macMin: "macOS 12 Monterey or later",
  arch: "Universal — Apple Silicon & Intel",

  author: "Jorge · Ignite & Elevate Marketing",
} as const;

// True once the .dmg URL is filled in (controls whether the CTA is live).
export const hasRealDownload = site.downloadUrl !== "#download";
