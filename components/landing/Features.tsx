import { Sparkle, Palette, Mic, Link as LinkIcon } from "@/components/icons";
import { Heart, Star } from "@/components/Doodles";

type Feature = {
  title: string;
  body: string;
  icon: (p: { className?: string }) => React.ReactNode;
  className: string; // grid span
};

const FEATURES: Feature[] = [
  {
    title: "The vibe engine",
    body: "Your Pinterest is your theme — applied globally and per-category. School can be dark academia while Life stays cozy.",
    icon: Sparkle,
    className: "sm:col-span-2 sm:row-span-2",
  },
  {
    title: "To-dos by category",
    body: "School, Life, Business — fully editable, with a satisfying check-off.",
    icon: Palette,
    className: "",
  },
  {
    title: "Voice notes",
    body: "Tap to talk and it transcribes. Or just type. Either, both, whatever.",
    icon: Mic,
    className: "",
  },
  {
    title: "It evolves",
    body: "The more you pin, the more it becomes you. The vibe grows up with you.",
    icon: Star,
    className: "sm:col-span-2",
  },
  {
    title: "Private & local-first",
    body: "Your data stays on your device. No account, no cloud, no snooping.",
    icon: LinkIcon,
    className: "",
  },
  {
    title: "Free for Mac",
    body: "A real native desktop app. Zero dollars, zero catch.",
    icon: Heart,
    className: "",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h2 className="mb-3 text-center font-display text-4xl text-text sm:text-5xl">
        Everything, but make it yours
      </h2>
      <p className="mx-auto mb-12 max-w-xl text-center text-text-soft">
        Two simple tools — to-dos and notes — wrapped in one aesthetic engine.
      </p>

      <div className="grid auto-rows-[1fr] grid-cols-1 gap-4 sm:grid-cols-3">
        {FEATURES.map((f) => (
          <article
            key={f.title}
            className={`sketch-card flex flex-col gap-3 p-5 ${f.className}`}
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent/15 text-accent">
              <f.icon className="h-6 w-6" />
            </span>
            <h3 className="font-display text-2xl text-text">{f.title}</h3>
            <p className="text-text-soft">{f.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
