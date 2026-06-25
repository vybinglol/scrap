import { Sparkle, Palette, Mic } from "@/components/icons";
import { Arrow } from "@/components/Doodles";

const STEPS = [
  {
    icon: Sparkle,
    title: "Pin your vibe",
    body: "Drop in a Pinterest board, pin, or link — whatever look you're chasing.",
  },
  {
    icon: Palette,
    title: "Scrapable becomes it",
    body: "It reads the palette + mood and re-themes itself — colors, fonts, decoration.",
  },
  {
    icon: Mic,
    title: "Get things done — your way",
    body: "To-dos by category and voice notes, wrapped in an aesthetic that's actually yours.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h2 className="mb-12 text-center font-display text-4xl text-text sm:text-5xl">
        How it works
      </h2>

      <ol className="grid gap-8 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <li key={s.title} className="relative flex flex-col items-center text-center">
            <span className="taped grid h-16 w-16 place-items-center rounded-2xl bg-surface text-accent shadow-sm">
              <s.icon className="h-7 w-7" />
            </span>
            <span className="mt-2 font-display text-xl text-text-soft">
              0{i + 1}
            </span>
            <h3 className="mt-1 font-display text-2xl text-text">{s.title}</h3>
            <p className="mt-2 max-w-xs text-text-soft">{s.body}</p>

            {i < STEPS.length - 1 && (
              <Arrow className="doodle absolute -right-6 top-7 hidden h-5 w-12 text-accent md:block" />
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
