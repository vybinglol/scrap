"use client";

import { LANDING_VIBES } from "@/lib/landingVibes";
import { useVibe } from "./LandingShell";
import { Arrow } from "@/components/Doodles";

// The hero's killer demo: a row of board chips that instantly re-theme the page.
export function VibeSwitcher() {
  const { vibe, setVibe } = useVibe();

  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Preview a vibe"
      >
        {LANDING_VIBES.map((v) => {
          const active = v.id === vibe.id;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => setVibe(v)}
              aria-pressed={active}
              className={`press rounded-full border-2 px-4 py-2 text-sm font-medium ${
                active
                  ? "text-on-accent"
                  : "border-line text-text hover:border-accent"
              }`}
              style={
                active
                  ? { background: "var(--accent)", borderColor: "var(--accent)" }
                  : undefined
              }
            >
              {/* swatch */}
              <span className="mr-2 inline-flex -space-x-1 align-middle">
                {[v.palette.bg, v.palette.accent, v.palette.accent2].map(
                  (c, i) => (
                    <span
                      key={i}
                      className="h-3 w-3 rounded-full border border-black/10"
                      style={{ background: c }}
                    />
                  ),
                )}
              </span>
              {v.label}
            </button>
          );
        })}
      </div>

      <p className="flex items-center gap-2 pl-1 font-display text-xl text-text-soft">
        <Arrow className="doodle h-4 w-10 shrink-0 -scale-x-100 text-accent" />
        {vibe.caption}
      </p>
    </div>
  );
}
