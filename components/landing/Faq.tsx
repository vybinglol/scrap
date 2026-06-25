import { site } from "@/lib/site";

const FAQS = [
  {
    q: "Is it really free?",
    a: "Yes — completely. No paywall, no account, no trial. Ko-fi is just an optional way to say thanks if you want to.",
  },
  {
    q: "Why does my Mac say the app can't be opened?",
    a: "Because it isn't notarized yet (that costs $99/yr and this is a free hobby app). Right-click the app → Open → Open the first time, and it'll open normally after that. It's safe and open source.",
  },
  {
    q: "Where's my data stored?",
    a: "Locally, on your device. Scrapable is local-first — your lists, notes, and pinned vibes never leave your machine.",
  },
  {
    q: "Windows or web?",
    a: "There's a web version you can use right now in any browser. A Windows build isn't ready yet — it's on the honest someday list.",
  },
];

export function Faq() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h2 className="mb-8 text-center font-display text-4xl text-text sm:text-5xl">
        Questions, answered
      </h2>
      <div className="flex flex-col gap-3">
        {FAQS.map((f) => (
          <details
            key={f.q}
            className="sketch-card group p-5 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-3 font-display text-xl text-text">
              {f.q}
              <span className="text-accent transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-text-soft">{f.a}</p>
          </details>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-text-soft">
        Still curious? Peek at the{" "}
        <a
          href={site.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-text underline decoration-accent decoration-2 underline-offset-2"
        >
          source on GitHub
        </a>
        .
      </p>
    </section>
  );
}
