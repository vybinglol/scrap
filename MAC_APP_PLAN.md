# Scrapable — macOS App Plan (Tauri 2)

How Scrapable ships as a downloadable Mac app that is **as lightweight as
possible** and **ready for future growth** (auto-update, native features,
eventually mobile) — from the same repo as the web app, with no UI fork.

---

## Why Tauri 2 (not Electron)

| | Electron | **Tauri 2** |
|---|---|---|
| Renderer | bundles Chromium (~150 MB) | OS-native **WKWebView** (nothing bundled) |
| "Hello world" | ~150 MB | **~3 MB** |
| Memory | high | low |
| Mobile | no | **iOS + Android from the same codebase** |

Tauri uses the system WebView and a small Rust core, so the binary is tiny and
launches fast. Critically for "future development," Tauri 2 targets desktop **and
mobile** — so the same React UI extends to iOS/Android later without a rewrite.

## Repo shape — one app, two build targets

A single Next.js app renders in the browser **and** the Tauri WebView. No
monorepo, no duplicated components.

- **Web (Vercel, default):** full Next.js — Route Handler `/api/vibe` (sharp),
  the `next/og` image, redirects, the landing page + web app.
- **Desktop (Tauri/macOS):** the **same** `app/` + `components/` + `lib/`,
  **statically exported** (`output: 'export'`), server logic moved to Rust.
- **Mobile (future):** Tauri 2 mobile reuses the same static export.

### The core problem: no Node server inside Tauri
Tauri has no Node runtime, so the frontend must be static-exported, which disables
Route Handlers, SSR, the OG image, and `redirects`. But the **web** build needs
those. Solved with two pieces, so the Vercel build is never touched:

1. **Env-gated `next.config.ts`** — when `TAURI_BUILD=1`: `output: 'export'`,
   `images: { unoptimized: true }`, `trailingSlash: true`, and `redirects` omitted.
   Otherwise the normal web config.
2. **`scripts/desktop-export.mjs`** (Tauri's `beforeBuildCommand`) — temporarily
   moves the server-only paths (`app/api`, `app/opengraph-image.tsx`) aside, runs
   the export, and restores them in a `finally`. A static route handler can't
   work because `/api/vibe` reads query params, so exclusion is the clean answer.

The desktop window opens directly to **`/app`** (the workspace), not the marketing
landing.

### The vibe engine on desktop — a Rust command behind a shared adapter
Only the one server-dependent step (URL → dominant colors) is reimplemented; all
palette/mood/contrast math stays shared in `lib/vibe.ts`.

- **`src-tauri/src/vibe.rs`** — `#[tauri::command] extract_vibe(url)` uses
  `reqwest` (native HTTP → **no CORS/canvas-taint**) to fetch the page, scans
  `og:image`/`og:title`, fetches the image, and runs the **same** 48×48 / 16-bucket
  histogram as the web's `sharp` pipeline. Returns `{ imageUrl, title, colors }`.
- **`lib/vibe-source.ts`** — `getVibeRaw(url)` calls the Rust command when
  `isTauri()`, else `fetch('/api/vibe')`. Identical JSON either way; the UI never
  knows which backend ran.

### Persistence
`localStorage` already works in the WebView (MVP). `lib/storage.ts` stays the
single swap point — upgrade to `@tauri-apps/plugin-store` / Supabase later behind
it, no UI change.

## Lightweight levers

- `src-tauri/Cargo.toml` release profile: `codegen-units = 1`, `lto = true`,
  `opt-level = "s"`, `panic = "abort"`, `strip = true`.
- `image` crate trimmed to `jpeg`/`png`/`webp` only; `reqwest` on rustls (no
  OpenSSL); og parsing via a small regex (no `scraper`).
- `sharp` stays server/web-only — never bundled into the desktop frontend.
- **Budget: `.dmg` ≤ ~10 MB.** (Measured size is reported in the README/release.)

## Code signing — tiered (free now, paid later)

- **Tier 0 — free, shipping now:** **ad-hoc sign** (`bundle.macOS.signingIdentity:
  "-"`). This stops macOS flagging Apple-Silicon GitHub downloads as "damaged."
  A free Apple account **cannot notarize**, so the "unidentified developer" prompt
  remains — the landing page's **right-click → Open** (or `xattr -cr
  /Applications/Scrapable.app`) instructions cover it.
- **Tier 1 — paid, later ($99/yr Apple Developer Program):** Developer ID
  Application cert + **notarization** → clean double-click install, no warnings.
  Flip these and nothing else:
  - `tauri.conf.json → bundle.macOS`: set `signingIdentity` to the Developer ID,
    add `"hardenedRuntime": true`, and an `entitlements` plist granting the
    WebView's JIT / unsigned-executable-memory entitlements
    (`com.apple.security.cs.allow-jit`, `…allow-unsigned-executable-memory`).
  - Provide notarization creds to the build (`APPLE_ID`, `APPLE_PASSWORD`,
    `APPLE_TEAM_ID`) — `tauri build` notarizes automatically.
  - **Remove** the right-click-to-open copy from the landing page
    (`components/landing/DownloadSection.tsx`, flagged with a comment).

## Auto-update (wired from v0.1)

- `tauri-plugin-updater` + `tauri-plugin-process`; `components/DesktopUpdater.tsx`
  calls `check()` on launch (guarded by `isTauri()`).
- Update signing keypair via `tauri signer generate`: **public** key in
  `tauri.conf.json plugins.updater.pubkey`; **private** key is gitignored and
  belongs in a CI secret (`TAURI_SIGNING_PRIVATE_KEY`). **Losing it means you can
  never sign updates** for installed builds.
- Endpoint: a static `latest.json` on **GitHub Releases** — no server. Published
  by the Phase 2 CI; until then the launch check just no-ops.

## Permissions

`src-tauri/capabilities/default.json` grants `core:default`, `updater:default`,
`process:default` to the `main` window. Future native capabilities (tray,
notifications for reminders, global shortcut for quick-add, deep links to open a
pin, filesystem) are **additive** here.

---

## Phased roadmap

### Phase 0 — Decisions & setup *(done — this document)*

### Phase 1 — Downloadable MVP *(done)*
Tauri 2 in the repo; static export wired; `extract_vibe` Rust command + `getVibeRaw`
adapter; localStorage; size-optimized Cargo profile; ad-hoc signing; updater wired;
**`npm run tauri build` produces a runnable `.dmg`**.
- Verify: `npm run tauri dev` opens the workspace; pasting a pin re-themes via the
  Rust command. `npm run tauri build` → `.dmg` in
  `src-tauri/target/release/bundle/dmg/`; right-click → Open to run.

### Phase 2 — Distribution & polish
- **GitHub Actions + `tauri-action`** on a `v*` tag: build the `.dmg`, sign,
  generate `latest.json`, publish to Releases → **"releasing is push a tag."**
  (Private key + Apple creds as repo secrets.) Update the landing's `DOWNLOAD_URL`
  to the Release asset.
- Auto-updates live via `latest.json`; menu-bar/tray + a native nicety or two.
- **Tier 1 signing/notarization runbook** executed once the $99 account is ready.

### Phase 3 — Future growth
- Mobile target (Tauri 2 iOS/Android) — UI + adapters are already mobile-friendly.
- LLM vibe analysis (Anthropic API) and Supabase sync slot in behind the existing
  `getVibeRaw` / `lib/storage.ts` adapters.
- Homebrew cask alongside the `.dmg`; Windows/Linux builds via the same export.

---

## Commands

```bash
npm run tauri dev      # run the desktop app against the Next dev server
npm run tauri build    # static-export + compile → .app and .dmg
# artifacts: src-tauri/target/release/bundle/{dmg,macos}/
```

Prereqs: **Rust** (`rustup`), **Node 18+**, **Xcode Command Line Tools**
(`xcode-select --install`). Universal/Intel build (later):
`npm run tauri build -- --target universal-apple-darwin` (add the `x86_64-apple-darwin`
rust target first).
