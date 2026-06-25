import { CheckMark, Squiggle, Star } from "@/components/Doodles";
import { Mic } from "@/components/icons";

// A fake-but-real-feeling Mac window showing the themed app. It's pure CSS and
// reads the page's theme variables, so it re-skins with the hero vibe switcher.
// Decorative — hidden from the a11y tree.
export function AppMockup() {
  const tasks = [
    { t: "Finish the mood board", done: true },
    { t: "Reply to the studio", done: false },
    { t: "Water the plants 🌱", done: false },
  ];

  return (
    <div
      aria-hidden
      className="rotate-[1.2deg] overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
    >
      {/* title bar */}
      <div className="flex items-center gap-2 border-b border-line bg-bg-2/60 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-display text-lg leading-none text-text-soft">
          Scrapable
        </span>
      </div>

      <div className="grid gap-4 p-4 sm:grid-cols-2">
        {/* to-do card */}
        <div className="sketch-card p-3">
          <div className="flex items-center justify-between">
            <span className="font-display text-2xl text-text">School</span>
            <Star className="doodle h-4 w-4 text-accent" />
          </div>
          <Squiggle className="doodle mb-2 mt-1 h-2 w-20 text-accent" />
          <ul className="flex flex-col gap-2">
            {tasks.map((row) => (
              <li key={row.t} className="flex items-center gap-2.5">
                <span
                  className="grid h-5 w-5 shrink-0 place-items-center rounded-[var(--checkbox-radius)] border-2"
                  style={{
                    borderColor: "var(--accent)",
                    background: row.done ? "var(--accent)" : "transparent",
                  }}
                >
                  {row.done && (
                    <span className="text-on-accent">
                      <CheckMark className="h-3 w-3" />
                    </span>
                  )}
                </span>
                <span
                  className={`text-sm text-text ${
                    row.done ? "line-through opacity-60" : ""
                  }`}
                >
                  {row.t}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* note card */}
        <div className="sketch-card flex flex-col gap-2 p-3">
          <div className="flex items-center justify-between">
            <span className="font-display text-2xl text-text">Notes</span>
            <span className="flex items-center gap-1 rounded-full bg-accent px-2 py-1 text-[10px] font-medium text-on-accent">
              <Mic className="h-3 w-3" /> Dictate
            </span>
          </div>
          <p className="note-body text-sm leading-relaxed text-text">
            picnic by the river, thrift the vintage store, bake focaccia and
            actually let it rise this time…
          </p>
        </div>
      </div>
    </div>
  );
}
