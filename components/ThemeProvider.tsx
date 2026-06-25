"use client";

import { useEffect } from "react";
import type { HouseVibe } from "@/lib/types";
import { themeVars } from "@/lib/vibe";

// Writes the house vibe onto <html> as live CSS variables + a data-preset
// attribute. Changing the vibe re-skins the whole app instantly — no reload.
// Per-category subtrees override the same variables locally (see CategoryColumn).
export function ThemeProvider({ houseVibe }: { houseVibe: HouseVibe }) {
  useEffect(() => {
    const root = document.documentElement;
    const vars = themeVars(houseVibe.palette);
    for (const [key, value] of Object.entries(vars)) {
      root.style.setProperty(key, value);
    }
    root.dataset.preset = houseVibe.preset;
  }, [houseVibe]);

  return null;
}
