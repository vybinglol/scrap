// Platform adapter for the vibe pipeline's one server-dependent step: turning a
// pasted URL into the dominant colors of its image.
//
//  - Web  → the Next.js Route Handler /api/vibe (uses sharp).
//  - Desktop (Tauri) → the Rust `extract_vibe` command (uses reqwest + image),
//    which also sidesteps browser CORS/canvas-taint entirely.
//
// Both return the SAME shape, so everything downstream (paletteFromColors, mood,
// contrast in lib/vibe.ts) is shared with no branching. The UI never knows which
// backend ran.

import { invoke, isTauri } from "@tauri-apps/api/core";
import type { ColorCount } from "./vibe";

export type RawVibe = {
  imageUrl: string | null;
  title: string | null;
  colors: ColorCount[];
};

const EMPTY: RawVibe = { imageUrl: null, title: null, colors: [] };

export async function getVibeRaw(url: string): Promise<RawVibe> {
  try {
    if (isTauri()) {
      return await invoke<RawVibe>("extract_vibe", { url });
    }
    const res = await fetch(`/api/vibe?url=${encodeURIComponent(url)}`);
    return res.ok ? ((await res.json()) as RawVibe) : EMPTY;
  } catch {
    return EMPTY;
  }
}
