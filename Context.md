# Context — Scrapable (project memory)

A pick-up-anywhere brief so a new chat (on any branch) has the full picture.
Pair this with `README.md` (run/deploy/release) and `MAC_APP_PLAN.md` (desktop app).

---

## What it is

**Scrapable** — a local-first **to-do + notes** web app whose entire look is
**generated from the user's Pinterest inspiration**. Paste a pin/board → the app
extracts a color palette + mood from its image and **re-themes itself live** (colors,
fonts, decoration), globally and per-scope. Plus a marketing landing page and a native
**macOS app** (Tauri 2). Voice: bilingual EN/ES.

Tone/brand: warm, scrapbook/sticker, hand-drawn, anti-corporate (Gen-Z, `vybinglol`).

## Where everything lives

- **GitHub:** `https://github.com/vybinglol/scrap` — **PUBLIC**. Production branch = `master`.
- **Web (Vercel):** `https://scrapable.app` — auto-deploys `master`, **zero env vars**.
  - `/` = marketing landing · `/app` = the web app · `/landing` → 301 to `/`.
- **Mac download (GitHub Releases):** latest = **v0.1.1**. Stable URL the landing uses:
  `https://github.com/vybinglol/scrap/releases/latest/download/Scrapable-AppleSilicon.dmg`
- **Ko-fi:** `https://ko-fi.com/vybinglol`.
- **All marketing/site constants in one file:** `lib/site.ts` (name, URLs, version, size).

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 (CSS-variable theming)
· `sharp` (server color extraction) · `localStorage` persistence · Tauri 2 (desktop).
No backend, no accounts, no env vars.

---

## The vibe engine (the heart of the app)

Three clean layers — reused across web + desktop:

1. **Extract** (server, has image bytes):
   - Web: `app/api/vibe/route.ts` (Node runtime, `sharp`) → fetch og:image → 48×48
     downscale → 16-bucket color histogram → top-8 `{hex,count}`.
   - Desktop: Rust `extract_vibe` command (`src-tauri/src/vibe.rs`, reqwest + image) —
     **same algorithm, same JSON shape**, native HTTP (no CORS).
   - Adapter `lib/vibe-source.ts` → `getVibeRaw(url)` branches on `isTauri()`.
2. **Decide** (pure, shared) — `lib/vibe.ts`: `paletteFromColors` (role assignment:
   bg/surface/accent/accent2/text), `deriveMood`, `moodToPreset`, **`clampContrast`**
   (guarantees AA legibility + `onAccent`), `aggregate` (blend many pins), `themeVars`.
3. **Apply** (live) — `components/ThemeProvider.tsx` writes the palette to CSS variables
   on `:root` + sets `data-preset`. Changing vars re-skins instantly, no reload.

**Three theming scopes:** house vibe (whole app), **per-category** (a list wears its
attached pin), **per-note** (a note's surface + typography). Pins attach via the reusable
`AttachVibe` control (the ✦ star) — on each list, the global "App vibe" button, and each
note (next to Dictate).

**Four presets** (`globals.css` `[data-preset]` blocks), each = fonts + texture + shape +
doodles: `cozy` (Caveat/Quicksand), `dark-academia` (Playfair/Inter), `minimal-clean`
(Inter), `playful-y2k` (Patrick Hand/Nunito). Per-note typography is pushed hard
(`.note-title` / `.note-body` rules) so attaching a pin restyles the whole writing surface.

**Theme tokens:** `--bg --surface --accent --accent-2 --text --text-soft --line --on-accent`.
Components only use the Tailwind utilities bound to these (`bg-bg`, `text-text`, `text-accent`,
`text-on-accent`, …) — never hardcoded colors.

## Key files

```
app/            page.tsx (LANDING) · app/page.tsx (the web app /app) · api/vibe/route.ts
                opengraph-image.tsx (next/og) · layout.tsx (fonts) · globals.css (tokens+presets)
components/     Workspace · TodoBoard · CategoryColumn · TaskItem · Notes · VoiceRecorder
                VibeShelf · AddInspiration · AttachVibe · ThemeProvider · DesktopUpdater
                landing/* (Hero, VibeSwitcher, AppMockup, Features, DownloadSection, KofiFloat, …)
lib/            vibe.ts (palette math) · vibe-source.ts (web/desktop adapter) · pinterest.ts
                storage.ts (localStorage; the Supabase swap point) · types.ts · site.ts · platform.ts
src-tauri/      Rust app (see below)
```

## Persistence

Everything (categories, tasks, notes, pins, house vibe) is in `localStorage`, behind
**`lib/storage.ts`** — the single swap point. `localStorage` is origin-scoped, so data is
per-browser/per-device and private; it survives path changes (e.g. `/`→`/app`).

---

## Mac app (Tauri 2) — Phase 1 shipped

- **One repo, one UI, two build targets.** Web = full Next.js. Desktop = the same UI
  **static-exported** (`output: 'export'`), server logic in Rust.
- **Dual build:** `next.config.ts` gates on `TAURI_BUILD=1`; `scripts/desktop-export.mjs`
  temporarily excludes the server-only `app/api` + OG route for the export, then restores
  them — **Vercel build untouched**. Desktop window opens to `/app`.
- **Size:** ad-hoc signed (`signingIdentity: "-"`, Tier 0), size-optimized Cargo profile →
  **~3.7 MB .dmg**, Apple-Silicon only (Intel/universal = documented next step).
- **Auto-update wired from v0.1:** `tauri-plugin-updater` + `components/DesktopUpdater.tsx`;
  `latest.json` on GitHub Releases.
- **Release = push a tag.** `.github/workflows/release.yml` (tauri-action) builds, signs,
  generates `latest.json`, and publishes all assets on any `v*` tag. Proven with v0.1.1.
  - To release: bump version in `package.json` **and** `src-tauri/tauri.conf.json` (and
    `Cargo.toml`/`Cargo.lock`), then `git tag vX.Y.Z && git push origin vX.Y.Z`.

## Commands

```bash
npm run dev            # web dev (localhost:3000) — / landing, /app the app
npm run build          # web production build (Vercel)
npm run lint
npm run tauri dev      # desktop app against the dev server
npm run tauri build    # desktop .app + .dmg → src-tauri/target/release/bundle/
```

---

## Secrets & safety (verified clean)

- Updater **private key** = `src-tauri/tauri-updater.key` — **gitignored, never committed**
  (history checked). Also stored as GitHub secret **`TAURI_SIGNING_PRIVATE_KEY`** (key has
  no password → workflow passes an empty password inline). **⚠️ If this key is lost, you can
  never sign updates for already-installed builds.** Public key is in `tauri.conf.json`.
- No `.env`, no API keys, no tokens anywhere in the repo (it's intentionally keyless).
- Future commits use the GitHub **noreply** email (`git config user.email` is set per-repo);
  pre-existing commits still carry the personal email (cosmetic; not rewritten).
- **Vercel telemetry:** `@vercel/analytics` + `@vercel/speed-insights` mounted in
  `app/layout.tsx` (web only; no-op in Tauri). Custom domain **scrapable.app** is live
  (apex on Vercel); `scrapable.vercel.app` still resolves as a fallback.

## Gotchas worth remembering

- Pinterest puts its `og:image`/`og:title` tags **~920 KB into a ~1 MB document** — scan
  generously (the route reads up to 3 MB), don't slice the first 200 KB.
- ESLint must ignore `out/**`, `src-tauri/**`, `.desktop-excluded/**` (in `eslint.config.mjs`)
  — otherwise it lints built/minified artifacts.
- React 16's hooks lint flags `set-state-in-effect` / ref-during-render; the
  hydration/platform-detect effects use targeted `eslint-disable` comments.
- `output: 'export'` can't include dynamic route handlers or `redirects` — that's the whole
  reason for the `TAURI_BUILD` gate + the desktop-export exclusion script.

## Known limits / natural next steps

- **Intel/universal Mac build** (add `x86_64-apple-darwin`, `--target universal-apple-darwin`).
- **Tier 1 signing/notarization** ($99 Apple Developer) → clean double-click install; then
  remove the right-click-to-open copy in `components/landing/DownloadSection.tsx`.
- **Supabase** sync (drop-in behind `lib/storage.ts`) + **LLM vibe naming** (Anthropic API,
  behind `getVibeRaw`).
- **Mobile** (Tauri 2 iOS/Android — UI + adapters already mobile-friendly); Homebrew cask;
  native niceties (tray, reminders, global quick-add).
