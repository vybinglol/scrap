"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { themeVars } from "@/lib/vibe";
import { DEFAULT_VIBE, type LandingVibe } from "@/lib/landingVibes";
import { KofiFloat } from "./KofiFloat";

type VibeContextValue = {
  vibe: LandingVibe;
  setVibe: (v: LandingVibe) => void;
};

const VibeContext = createContext<VibeContextValue | null>(null);

export function useVibe() {
  const ctx = useContext(VibeContext);
  if (!ctx) throw new Error("useVibe must be used inside <LandingShell>");
  return ctx;
}

// Owns the selected demo vibe and re-skins the whole page live by writing the
// palette to :root + setting data-preset — the same mechanism the real app uses
// (components/ThemeProvider.tsx), here driven by the hero's chips.
export function LandingShell({ children }: { children: ReactNode }) {
  const [vibe, setVibe] = useState<LandingVibe>(DEFAULT_VIBE);

  useEffect(() => {
    const root = document.documentElement;
    const vars = themeVars(vibe.palette);
    for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v);
    root.dataset.preset = vibe.preset;
    return () => {
      // Leaving the landing: hand styling back to the app's ThemeProvider.
      for (const k of Object.keys(themeVars(vibe.palette)))
        root.style.removeProperty(k);
    };
  }, [vibe]);

  return (
    <VibeContext.Provider value={{ vibe, setVibe }}>
      <div className="min-h-screen bg-bg text-text transition-colors duration-500">
        {children}
      </div>
      <KofiFloat />
    </VibeContext.Provider>
  );
}
