// The demo vibes behind the hero switcher. Each maps a hand-picked palette to
// one of the app's real presets (cozy / dark-academia / minimal-clean /
// playful-y2k), so clicking a chip re-skins the page exactly the way pinning a
// board re-skins the app. Palettes run through clampContrast() for AA legibility.

import { clampContrast } from "./vibe";
import type { Palette, Preset } from "./types";

export type LandingVibe = {
  id: string;
  label: string;
  preset: Preset;
  palette: Palette;
  caption: string; // hand-drawn aside shown when active
};

function vibe(
  id: string,
  label: string,
  preset: Preset,
  palette: Palette,
  caption: string,
): LandingVibe {
  return { id, label, preset, palette: clampContrast(palette), caption };
}

export const LANDING_VIBES: LandingVibe[] = [
  vibe(
    "cottagecore",
    "Cottagecore",
    "cozy",
    {
      bg: "#f7f1e3",
      surface: "#fffdf6",
      accent: "#7c9a5e",
      accent2: "#e6a468",
      text: "#42402f",
    },
    "soft, warm, a little overgrown 🌿",
  ),
  vibe(
    "academia",
    "Dark Academia",
    "dark-academia",
    {
      bg: "#1c1a17",
      surface: "#262219",
      accent: "#c08a4a",
      accent2: "#8c3b32",
      text: "#ece3d2",
    },
    "candlelit library energy 🕯️",
  ),
  vibe(
    "y2k",
    "Y2K",
    "playful-y2k",
    {
      bg: "#fff0f8",
      surface: "#ffffff",
      accent: "#ff3da6",
      accent2: "#21d3ec",
      text: "#2a1430",
    },
    "loud, bubbly, very online ✨",
  ),
  vibe(
    "minimal",
    "Clean Minimal",
    "minimal-clean",
    {
      bg: "#f4f4f2",
      surface: "#ffffff",
      accent: "#3b3b3b",
      accent2: "#9b9b9b",
      text: "#1b1b1b",
    },
    "nothing extra, just space 🤍",
  ),
];

export const DEFAULT_VIBE = LANDING_VIBES[0];
