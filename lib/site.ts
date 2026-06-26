// One place to edit everything marketing-facing. Drop the real GitHub Release
// .dmg URL into DOWNLOAD_URL when the Tauri build is published.

export const site = {
  name: "Scrapable",
  tagline: "Your to-do list, but make it yours.",

  // The browser web app (this same repo, served at "/app").
  webAppPath: "/app",

  // Ko-fi (handle stays "vybinglol").
  kofiUser: "vybinglol",
  kofiUrl: "https://ko-fi.com/vybinglol",

  // Mac download — stable "latest release" asset URL, so this never needs
  // updating per release (the GitHub Release just has to keep this asset name).
  downloadUrl:
    "https://github.com/vybinglol/scrap/releases/latest/download/Scrapable-AppleSilicon.dmg",
  githubUrl: "https://github.com/vybinglol/scrap",

  // Shown near the download button. Update to match the published build.
  version: "0.1.0",
  fileSize: "3.7 MB",
  macMin: "macOS 12 Monterey or later",
  arch: "Apple Silicon (M1–M4) — Intel build coming soon",

  author: "Jorge · Ignite & Elevate Marketing",
} as const;
