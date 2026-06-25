import { site } from "@/lib/site";
import { Heart } from "@/components/Doodles";

export function SupportKofi() {
  return (
    <section
      id="support"
      className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6"
    >
      <div className="sketch-card taped relative flex flex-col items-center gap-4 p-8">
        <Heart className="doodle absolute -right-3 -top-3 h-8 w-8 -rotate-12 text-accent-2" />
        <h2 className="font-display text-4xl text-text sm:text-5xl">
          It&apos;s free. Like, actually free.
        </h2>
        <p className="max-w-xl text-lg text-text-soft">
          No paywall. No account. No &ldquo;upgrade to Pro.&rdquo; Scrapable is
          free and always will be. If it makes your day a little brighter, you can
          buy me a coffee — totally optional, zero pressure.
        </p>
        <a
          href={site.kofiUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="press inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-base font-semibold text-on-accent shadow-lg"
        >
          Support Scrapable on Ko-fi ☕
        </a>
      </div>
    </section>
  );
}
