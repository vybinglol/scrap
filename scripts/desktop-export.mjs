// Static-export the frontend for the Tauri desktop build.
//
// Static export (`output: "export"`) can't include the dynamic Route Handler
// (app/api/vibe reads query params) or the edge OG image — they'd fail the build.
// The desktop app doesn't need them anyway (it uses the Rust `extract_vibe`
// command and has no SEO surface). So we temporarily move those server-only
// paths aside, run the export, and always restore them — leaving the Vercel
// build completely untouched.

import { execSync } from "node:child_process";
import { existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";

const root = process.cwd();
const STASH = join(root, ".desktop-excluded");

// Paths that must not be part of a static export.
const SERVER_ONLY = ["app/api", "app/opengraph-image.tsx"];

function stash() {
  if (existsSync(STASH)) rmSync(STASH, { recursive: true, force: true });
  mkdirSync(STASH, { recursive: true });
  for (const rel of SERVER_ONLY) {
    const from = join(root, rel);
    if (!existsSync(from)) continue;
    const to = join(STASH, rel);
    mkdirSync(dirname(to), { recursive: true });
    renameSync(from, to);
  }
}

function restore() {
  for (const rel of SERVER_ONLY) {
    const from = join(STASH, rel);
    if (!existsSync(from)) continue;
    const to = join(root, rel);
    mkdirSync(dirname(to), { recursive: true });
    renameSync(from, to);
  }
  rmSync(STASH, { recursive: true, force: true });
}

stash();
try {
  execSync("next build", {
    stdio: "inherit",
    env: { ...process.env, TAURI_BUILD: "1" },
  });
} finally {
  restore();
}
