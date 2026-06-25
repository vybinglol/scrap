import { themeVars } from "@/lib/vibe";
import { LANDING_VIBES, type LandingVibe } from "@/lib/landingVibes";
import { CheckMark, Squiggle } from "@/components/Doodles";

// Three copies of the same little app, each pinned to a different vibe — proof
// that swapping the inspiration transforms everything. Each panel forces its own
// theme via inline vars + data-preset, independent of the page's live vibe.
const SHOWCASE = ["cottagecore", "academia", "minimal"]
  .map((id) => LANDING_VIBES.find((v) => v.id === id))
  .filter((v): v is LandingVibe => Boolean(v));

function MiniApp({ vibe }: { vibe: LandingVibe }) {
  return (
    <div
      data-preset={vibe.preset}
      style={themeVars(vibe.palette) as React.CSSProperties}
      className="rounded-3xl bg-bg p-5"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="font-display text-2xl text-text">{vibe.label}</span>
        <span className="flex gap-1">
          {[vibe.palette.accent, vibe.palette.accent2, vibe.palette.text].map(
            (c, i) => (
              <span
                key={i}
                className="h-3.5 w-3.5 rounded-full border border-black/10"
                style={{ background: c }}
              />
            ),
          )}
        </span>
      </div>

      <div className="sketch-card p-4">
        <span className="font-display text-xl text-text">Today</span>
        <Squiggle className="doodle mb-2 mt-1 h-2 w-16 text-accent" />
        <ul className="flex flex-col gap-2">
          {["Make it pretty", "Then make it done"].map((t, i) => (
            <li key={t} className="flex items-center gap-2.5">
              <span
                className="grid h-5 w-5 place-items-center rounded-[var(--checkbox-radius)] border-2"
                style={{
                  borderColor: "var(--accent)",
                  background: i === 0 ? "var(--accent)" : "transparent",
                }}
              >
                {i === 0 && (
                  <span className="text-on-accent">
                    <CheckMark className="h-3 w-3" />
                  </span>
                )}
              </span>
              <span
                className={`note-body text-sm text-text ${
                  i === 0 ? "line-through opacity-60" : ""
                }`}
              >
                {t}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function TransformShowcase() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h2 className="mb-3 text-center font-display text-4xl text-text sm:text-5xl">
        Same app. Wildly different soul.
      </h2>
      <p className="mx-auto mb-12 max-w-xl text-center text-text-soft">
        Swap the board you pinned and the whole thing transforms — typography,
        color, and decoration included.
      </p>

      <div className="grid gap-5 md:grid-cols-3">
        {SHOWCASE.map((v) => (
          <MiniApp key={v.id} vibe={v} />
        ))}
      </div>
    </section>
  );
}
