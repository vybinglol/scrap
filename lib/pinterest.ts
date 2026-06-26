// URL parsing + vibe fetching for Pinterest inspiration.
//
// Pins are no longer embedded as a gallery — they're the *source of the theme*.
// So this module classifies a pasted URL and fetches the colors the server
// pulled from its image, turning them into a cached palette via lib/vibe.

import type { Mood, Palette, PinKind } from "./types";
import { paletteFromColors } from "./vibe";
import { getVibeRaw } from "./vibe-source";

const PIN_HOSTS = new Set([
  "pinterest.com",
  "www.pinterest.com",
  "pin.it",
  "pinterest.ca",
  "pinterest.co.uk",
  "www.pinterest.ca",
  "www.pinterest.co.uk",
]);

// Pinterest "system" path segments that are never usernames.
const RESERVED = new Set([
  "pin",
  "search",
  "ideas",
  "settings",
  "business",
  "today",
  "categories",
  "news_hub",
  "_",
]);

export type ParsedUrl = { kind: PinKind; url: string };

/**
 * Classify a pasted URL:
 *  - contains `/pin/`   -> pin
 *  - `/{user}/{board}/` -> board
 *  - `/{user}/`         -> profile
 *  - anything else      -> link
 */
export function parsePinterestUrl(input: string): ParsedUrl {
  const raw = input.trim();
  if (!raw) return { kind: "link", url: raw };

  let u: URL;
  try {
    u = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
  } catch {
    return { kind: "link", url: raw };
  }

  const host = u.hostname.toLowerCase();
  if (!PIN_HOSTS.has(host)) return { kind: "link", url: u.toString() };
  if (host === "pin.it") return { kind: "pin", url: u.toString() };

  const segments = u.pathname.split("/").filter(Boolean);
  if (segments.includes("pin")) return { kind: "pin", url: u.toString() };
  if (segments.length >= 1 && RESERVED.has(segments[0]))
    return { kind: "link", url: u.toString() };
  if (segments.length >= 2) return { kind: "board", url: u.toString() };
  if (segments.length === 1) return { kind: "profile", url: u.toString() };
  return { kind: "link", url: u.toString() };
}

export type PinVibe = {
  imageUrl?: string;
  title?: string;
  palette?: Palette;
  mood?: Mood;
};

// Get the dominant colors of a URL's image (via the web Route Handler or the
// desktop Rust command — see lib/vibe-source.ts), then turn them into a
// role-assigned palette + mood. Best-effort: returns {} on any failure so the
// pin still saves (it just won't contribute to the theme).
export async function fetchPinVibe(url: string): Promise<PinVibe> {
  try {
    const data = await getVibeRaw(url);
    const out: PinVibe = {
      imageUrl: data.imageUrl ?? undefined,
      title: data.title ?? undefined,
    };
    if (data.colors?.length) {
      const { palette, mood } = paletteFromColors(data.colors);
      out.palette = palette;
      out.mood = mood;
    }
    return out;
  } catch {
    return {};
  }
}
