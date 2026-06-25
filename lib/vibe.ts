// The design brain. Pure, isomorphic, dependency-free: turns the dominant colors
// the server pulled out of a pinned image into a usable, *legible* theme — role
// assignment, mood classification, preset selection, contrast clamping, and the
// aggregation of many pins into one "house vibe".

import type { HouseVibe, Mood, Palette, Pin, Preset } from "./types";

export type ColorCount = { hex: string; count: number };

type RGB = { r: number; g: number; b: number };

// --- color primitives ----------------------------------------------------

function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  const n = parseInt(
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h,
    16,
  );
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex({ r, g, b }: RGB): string {
  const to = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v)))
      .toString(16)
      .padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

// WCAG relative luminance (0 = black, 1 = white).
function luminance({ r, g, b }: RGB): number {
  const lin = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrast(a: RGB, b: RGB): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

function saturation({ r, g, b }: RGB): number {
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  const l = (max + min) / 2;
  if (max === min) return 0;
  const d = max - min;
  return l > 0.5 ? d / (2 - max - min) : d / (max + min);
}

function hue({ r, g, b }: RGB): number {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  if (d === 0) return 0;
  let h: number;
  if (max === rn) h = ((gn - bn) / d) % 6;
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;
  h *= 60;
  return h < 0 ? h + 360 : h;
}

function mix(a: RGB, b: RGB, t: number): RGB {
  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  };
}

const WHITE: RGB = { r: 255, g: 255, b: 255 };
const BLACK: RGB = { r: 20, g: 18, b: 16 };

// Pick whichever of (near-)black/white reads best on a background.
function readableOn(bg: RGB): RGB {
  return contrast(WHITE, bg) >= contrast(BLACK, bg) ? WHITE : BLACK;
}

// --- role assignment -----------------------------------------------------

export function paletteFromColors(colors: ColorCount[]): {
  palette: Palette;
  mood: Mood;
} {
  if (!colors.length) return { palette: DEFAULT_PALETTE, mood: DEFAULT_MOOD };

  const swatches = colors.map((c) => {
    const rgb = hexToRgb(c.hex);
    return { rgb, count: c.count, lum: luminance(rgb), sat: saturation(rgb) };
  });

  const totalCount = swatches.reduce((s, x) => s + x.count, 0) || 1;
  const weightedLum =
    swatches.reduce((s, x) => s + x.lum * x.count, 0) / totalCount;
  const isDark = weightedLum < 0.42;

  const byLum = [...swatches].sort((a, b) => a.lum - b.lum);
  const darkest = byLum[0].rgb;
  const lightest = byLum[byLum.length - 1].rgb;

  let bg: RGB;
  let surface: RGB;
  let text: RGB;
  if (isDark) {
    bg = mix(darkest, BLACK, 0.15);
    surface = mix(bg, lightest, 0.12);
    text = mix(lightest, WHITE, 0.25);
  } else {
    bg = mix(lightest, WHITE, 0.45); // soft tinted paper, never stark white
    surface = mix(bg, WHITE, 0.5);
    text = mix(darkest, BLACK, 0.2);
  }

  // Accent = the most colorful swatch, weighted a little by how much of it there
  // is so a stray vivid pixel doesn't win. Reject near-greys.
  const colorful = [...swatches]
    .filter((x) => x.sat > 0.18)
    .sort((a, b) => b.sat * Math.sqrt(b.count) - a.sat * Math.sqrt(a.count));

  // Near-monochrome images can leave an accent that's nearly the background.
  // Nudge it toward white/black until it actually stands out.
  const pop = (a: RGB): RGB => {
    let out = a;
    let guard = 0;
    while (contrast(out, bg) < 1.9 && guard < 9) {
      out = mix(out, isDark ? WHITE : BLACK, 0.12);
      guard++;
    }
    return out;
  };
  const accent = pop((colorful[0] ?? byLum[Math.floor(byLum.length / 2)]).rgb);
  const accent2 = pop((colorful[1] ?? colorful[0] ?? { rgb: accent }).rgb);

  const palette = clampContrast({
    bg: rgbToHex(bg),
    surface: rgbToHex(surface),
    accent: rgbToHex(accent),
    accent2: rgbToHex(accent2),
    text: rgbToHex(text),
  });

  return { palette, mood: deriveMood(palette) };
}

// Guarantee the UI is legible no matter what was pinned.
export function clampContrast(p: Palette): Palette {
  const bg = hexToRgb(p.bg);
  let text = hexToRgb(p.text);

  // Push text toward black or white until it clears AA body contrast.
  const target = readableOn(bg);
  let t = 0;
  while (contrast(text, bg) < 4.5 && t < 1) {
    t += 0.1;
    text = mix(hexToRgb(p.text), target, t);
  }

  // Keep surface visibly distinct from bg.
  let surface = hexToRgb(p.surface);
  if (contrast(surface, bg) < 1.06) {
    surface = mix(surface, luminance(bg) < 0.5 ? WHITE : BLACK, 0.06);
  }

  return {
    ...p,
    text: rgbToHex(text),
    surface: rgbToHex(surface),
  };
}

// Readable foreground (#fff / near-black) for text sitting on a solid color —
// used by the manual per-category accent fallback.
export function onAccentColor(hex: string): string {
  return rgbToHex(readableOn(hexToRgb(hex)));
}

// Extra CSS variables derived from a palette at apply-time.
export function themeVars(p: Palette): Record<string, string> {
  const bg = hexToRgb(p.bg);
  const text = hexToRgb(p.text);
  const accent = hexToRgb(p.accent);
  return {
    "--bg": p.bg,
    "--bg-2": rgbToHex(mix(bg, text, 0.05)),
    "--surface": p.surface,
    "--accent": p.accent,
    "--accent-2": p.accent2,
    "--text": p.text,
    "--text-soft": rgbToHex(mix(text, bg, 0.42)),
    "--line": rgbToHex(mix(bg, text, 0.16)),
    "--on-accent": rgbToHex(readableOn(accent)),
  };
}

// --- mood + preset -------------------------------------------------------

export function deriveMood(p: Palette): Mood {
  const bg = hexToRgb(p.bg);
  const accent = hexToRgb(p.accent);
  const h = hue(accent);

  const warmth: Mood["warmth"] =
    h <= 70 || h >= 320 ? "warm" : h >= 150 && h <= 280 ? "cool" : "neutral";

  return {
    lightness: luminance(bg) > 0.5 ? "light" : "dark",
    saturation: saturation(accent) > 0.45 ? "vivid" : "muted",
    warmth,
  };
}

export function moodToPreset(mood: Mood): Preset {
  if (mood.lightness === "dark") return "dark-academia";
  if (mood.saturation === "vivid") return "playful-y2k";
  return mood.warmth === "warm" ? "cozy" : "minimal-clean";
}

// Build a full house vibe from a single palette (used when the user pins one
// specific board/pin for the whole app or a single surface).
export function vibeFromPalette(palette: Palette, mood?: Mood): HouseVibe {
  const m = mood ?? deriveMood(palette);
  return { palette, mood: m, preset: moodToPreset(m) };
}

// The CSS variables + preset a surface should wear from an attached pin.
// Shared by category columns and notes. Returns {} when the pin has no palette.
export function pinScope(pin?: { palette?: Palette; mood?: Mood }): {
  vars?: Record<string, string>;
  preset?: Preset;
} {
  if (!pin?.palette) return {};
  return {
    vars: themeVars(pin.palette),
    preset: moodToPreset(pin.mood ?? deriveMood(pin.palette)),
  };
}

// --- aggregation ---------------------------------------------------------

export function aggregate(pins: Pin[]): HouseVibe {
  const themed = pins.filter((p) => p.palette);
  if (!themed.length) return DEFAULT_HOUSE_VIBE;

  const avg = (pick: (p: Palette) => string): RGB => {
    const rgbs = themed.map((p) => hexToRgb(pick(p.palette!)));
    return {
      r: rgbs.reduce((s, c) => s + c.r, 0) / rgbs.length,
      g: rgbs.reduce((s, c) => s + c.g, 0) / rgbs.length,
      b: rgbs.reduce((s, c) => s + c.b, 0) / rgbs.length,
    };
  };

  // Accents: the most saturated wins (averaging would mud them out).
  const accents = themed
    .map((p) => p.palette!)
    .sort((a, b) => saturation(hexToRgb(b.accent)) - saturation(hexToRgb(a.accent)));

  const palette = clampContrast({
    bg: rgbToHex(avg((p) => p.bg)),
    surface: rgbToHex(avg((p) => p.surface)),
    accent: accents[0].accent,
    accent2: (accents[1] ?? accents[0]).accent2,
    text: rgbToHex(avg((p) => p.text)),
  });

  const mood = deriveMood(palette);
  return { palette, mood, preset: moodToPreset(mood) };
}

// --- defaults (the tasteful empty state) ---------------------------------

export const DEFAULT_PALETTE: Palette = {
  bg: "#faf4e9",
  surface: "#fffdf7",
  accent: "#7c9cff",
  accent2: "#ff9eb1",
  text: "#3b352f",
};

export const DEFAULT_MOOD: Mood = {
  warmth: "warm",
  lightness: "light",
  saturation: "muted",
};

export const DEFAULT_HOUSE_VIBE: HouseVibe = {
  palette: DEFAULT_PALETTE,
  mood: DEFAULT_MOOD,
  preset: "cozy",
};
