# Scrapable ✨

A to-do + notes app whose **entire look is generated from your Pinterest
inspiration**. Paste a pin or board and the app extracts its colors and mood and
**re-themes itself live** — background, surfaces, accents, typography, and
decoration. Pin dark moody academia and the whole app turns moody and dark; pin
bright bold Y2K and it gets loud and playful. The pins aren't a gallery — they're
the source of the design system, and the look evolves as you add more.

Three tools, one aesthetic engine:

1. **To-Dos** — tasks grouped by editable categories (School / Life / Business to
   start). Animated check-off, completed tasks settle into a collapsible "Done"
   group. Each category can be themed by **its own** attached pin.
2. **Notes** — type or **dictate** (browser voice transcription), autosaved.
   Themed by the global house vibe.
3. **The vibe engine** — paste a Pinterest pin / board / profile / link → extract
   a palette + mood → apply it as the live theme, globally and per-category.

Single user, single device, local-first. No accounts, no backend, no keys.

## How the vibe engine works

Three clean layers:

1. **Extract** — `app/api/vibe/route.ts` (the only server code, no secrets) finds
   the representative image via Open Graph tags, then uses **`sharp`** to decode
   and downscale it and returns its dominant colors as a histogram.
2. **Decide** — `lib/vibe.ts` (pure, isomorphic) turns those colors into a theme:
   assigns roles (`bg` / `surface` / `accent` / `accent2` / `text`), classifies a
   **mood** (warm/cool · light/dark · muted/vivid), maps the mood to one of four
   **presets** (`cozy` / `dark-academia` / `minimal-clean` / `playful-y2k`), and
   **clamps contrast** so text and buttons stay readable on any generated theme.
   It also aggregates every pin into one "house vibe."
3. **Apply** — `components/ThemeProvider.tsx` writes the palette to CSS variables
   on `:root` and sets `data-preset` on `<html>`. Each `CategoryColumn` writes the
   same variables on its own section, so a column can wear a different vibe than
   the app around it. Changing the variables re-skins everything instantly — no
   reload.

Each **preset** bundles a font pairing, a background texture, corner/shape style,
and whether hand-drawn doodles show — so switching mood changes far more than color.

## Tech

- **Next.js 16 (App Router) + React 19 + TypeScript**
- **Tailwind CSS v4**, themed entirely through CSS custom properties
- **`sharp`** for server-side color extraction (works on Vercel out of the box)
- **Persistence: `localStorage`**, behind one data layer (`lib/storage.ts`)
- **No environment variables.** `git push` → Vercel ships it.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build
npm run start    # serve the production build
```

> **Voice dictation** uses the browser-native Web Speech API — best in Chrome /
> Edge. Where unsupported, the mic hides and typing works exactly as before.

## Routes

- **`/`** — the marketing landing page (the front door). One Vercel deploy serves
  both. Its hero has a live **vibe switcher** that re-skins the whole page using the
  same CSS-variable + preset mechanism as the app (`components/landing/`, demo
  palettes in `lib/landingVibes.ts`). Edit all marketing constants — name, Ko-fi
  URL, and the **`DOWNLOAD_URL`** placeholder — in **`lib/site.ts`**.
- **`/app`** — the web app itself (the vibe-driven to-do + notes tool). The old
  `/landing` URL redirects to `/`.

## Mac build (Tauri) — for the landing's download button

The landing's "Download free for Mac" points at `site.DOWNLOAD_URL` (a placeholder
until you publish a build):

1. Wrap this Next.js frontend with **Tauri** and build a universal binary:
   `cargo tauri build --target universal-apple-darwin` → produces a `.dmg` in
   `src-tauri/target/release/bundle/`.
2. Upload that `.dmg` as a **GitHub Releases** asset and paste its URL into
   `DOWNLOAD_URL` in `lib/site.ts` (also update `version` / `fileSize`).
3. Unless you join the Apple Developer Program ($99/yr) and **notarize**, macOS
   shows an "unidentified developer" warning. The landing's Download section already
   carries the right-click → Open instructions — **remove that block once notarized**
   (it's flagged with a comment in `components/landing/DownloadSection.tsx`).

## Deploy to Vercel (zero config)

1. Push to GitHub.
2. Vercel → **New Project → import the repo** (auto-detects Next.js).
3. Deploy. **No environment variables required.** `sharp` builds automatically on
   Vercel's Node runtime.

## Project structure

```
app/
  layout.tsx          fonts for all four presets; sets the default preset
  page.tsx            renders <Workspace/>
  api/vibe/route.ts   og:image + sharp color histogram (the only server code)
  globals.css         theme tokens + the four [data-preset] decoration blocks
components/
  ThemeProvider.tsx   writes the house vibe to CSS variables, live
  Workspace.tsx       holds state; derives the house vibe from the pins
  TodoBoard.tsx / CategoryColumn.tsx / TaskItem.tsx / AddCategory.tsx
  Notes.tsx / VoiceRecorder.tsx
  AddInspiration.tsx  paste URL -> /api/vibe -> palette
  VibeShelf.tsx       house-vibe summary + "where this vibe came from"
  Doodles.tsx, icons.tsx
lib/
  types.ts            Category / Task / Note / Pin / Palette / Mood / Preset / HouseVibe
  storage.ts          localStorage data layer + seeded defaults  ← Supabase swap point
  vibe.ts             role assignment, mood, presets, contrast clamp, aggregation
  pinterest.ts        URL classifier + fetchPinVibe()
  useLocalState.ts    SSR-safe "state mirrored to storage" hook
```

## Swapping localStorage for a backend later

Every read/write goes through `lib/storage.ts`. Re-implement those functions
against Supabase and nothing else changes.

## Upgrade paths (not built — natural next steps)

- **Smarter vibe reading:** send the pinned image(s) to an LLM (the Anthropic API)
  to *name* the aesthetic and pick fonts/decoration intelligently instead of the
  keyless heuristic presets. Needs one API key (one env var) — the natural step
  after this keyless MVP.
- **Supabase** for multi-device sync (the storage layer is already abstracted).
- **Whisper** for reliable cross-browser dictation.

## Notes / known limits

- Local-first by design: data lives in this browser's `localStorage`.
- For a board/profile, Pinterest's og:image is a representative collage — good
  enough for a palette; richer extraction (sampling several pin images) is a
  future tweak.
- On reload the theme animates from the neutral default into your house vibe
  (localStorage is client-only, so the server can't pre-render it). The transition
  is intentional; an inline no-flash script is a possible polish.
